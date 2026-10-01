import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';
import { createRef, type RefObject } from 'react';

import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The header has its own dependencies (store, router, permissions); only its collapse contract matters here
vi.mock('@ie-objects/components/ObjectDetailPageHeader/ObjectDetailPageHeader', () => ({
	ObjectDetailPageHeader: ({
		isCollapsed,
		onShowDetails,
	}: {
		isCollapsed: boolean;
		onShowDetails: () => void;
	}) => (
		<div data-testid="header" data-collapsed={String(isCollapsed)}>
			<button type="button" onClick={onShowDetails}>
				toon details
			</button>
		</div>
	),
}));

import { ObjectDetailTabs } from '@ie-objects/ie-objects.types';
import { ObjectDetailPageSidebar } from './ObjectDetailPageSidebar';
import type { ObjectDetailPageSidebarProps } from './ObjectDetailPageSidebar.types';

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

let observerCallback: ObserverCallback;
let observerOptions: IntersectionObserverInit | undefined;
const disconnect = vi.fn();

const renderSidebar = (overrides: Partial<ObjectDetailPageSidebarProps> = {}) => {
	const containerRef = createRef<HTMLDivElement>() as RefObject<HTMLDivElement | null>;
	const utils = render(
		<ObjectDetailPageSidebar
			mediaInfo={undefined}
			onClickAction={vi.fn()}
			hasAccessToVisitorSpaceOfObject={false}
			currentPageIndex={0}
			onReadMoreClicked={vi.fn()}
			activeTab={ObjectDetailTabs.Metadata}
			similar={[]}
			tabs={<div data-testid="tabs" />}
			containerRef={containerRef}
			isProgrammaticScrollRef={{ current: false }}
			{...overrides}
		>
			<div data-testid="content" />
		</ObjectDetailPageSidebar>
	);
	const container = containerRef.current as HTMLDivElement;
	container.scrollTo = vi.fn() as unknown as typeof container.scrollTo;
	return { ...utils, containerRef, container };
};

/** Fakes the layout jsdom doesn't compute: whether the container has anything to scroll */
const setOverflow = (container: HTMLElement, hasOverflow: boolean) => {
	Object.defineProperty(container, 'scrollHeight', {
		value: hasOverflow ? 1000 : 400,
		configurable: true,
	});
	Object.defineProperty(container, 'clientHeight', { value: 400, configurable: true });
};

const isCollapsed = () => screen.getByTestId('header').dataset.collapsed === 'true';
const reportSentinel = (isIntersecting: boolean) =>
	act(() => observerCallback([{ isIntersecting }]));

describe('Component: <ObjectDetailPageSidebar />', () => {
	beforeEach(() => {
		disconnect.mockClear();
		vi.stubGlobal(
			'IntersectionObserver',
			class {
				constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
					observerCallback = callback;
					observerOptions = options;
				}
				observe = vi.fn();
				disconnect = disconnect;
			}
		);
	});

	it('renders the tabs inside the sticky unit and the tab content below it', () => {
		renderSidebar();

		const sticky = screen.getByTestId('header').parentElement as HTMLElement;
		expect(sticky).toHaveClass('c-object-detail-sidebar__sticky');
		expect(sticky).toContainElement(screen.getByTestId('tabs'));
		expect(sticky).not.toContainElement(screen.getByTestId('content'));
	});

	it('applies the class name of the hosting page and the active tab modifier', () => {
		const { container } = renderSidebar({
			className: 'from-page',
			activeTab: ObjectDetailTabs.Ocr,
		});

		expect(container.parentElement).toHaveClass('from-page');
		expect(container).toHaveClass('c-object-detail-sidebar__content--tab-ocr');
	});

	it('only removes the bottom padding for the overview when it ends in the similar list', () => {
		const similar = [{ id: 'a', title: 'a', subtitle: '', description: '', type: null }];
		const { container, rerender } = renderSidebar({
			activeTab: ObjectDetailTabs.Overview,
			similar,
		});
		expect(container).toHaveClass('c-object-detail-sidebar__content--ends-in-list');

		rerender(
			<ObjectDetailPageSidebar
				mediaInfo={undefined}
				onClickAction={vi.fn()}
				hasAccessToVisitorSpaceOfObject={false}
				currentPageIndex={0}
				onReadMoreClicked={vi.fn()}
				activeTab={ObjectDetailTabs.Metadata}
				similar={similar}
				tabs={null}
				containerRef={{ current: container }}
				isProgrammaticScrollRef={{ current: false }}
			>
				{null}
			</ObjectDetailPageSidebar>
		);
		expect(container).not.toHaveClass('c-object-detail-sidebar__content--ends-in-list');
	});

	describe('header collapse', () => {
		it('observes the sentinel inside the scroll container', () => {
			const { container } = renderSidebar();

			expect(observerOptions?.root).toBe(container);
			expect(isCollapsed()).toBe(false);
		});

		it('collapses when the sentinel scrolls out of view', () => {
			renderSidebar();

			reportSentinel(false);

			expect(isCollapsed()).toBe(true);
			expect(screen.getByTestId('header').parentElement).toHaveClass(
				'c-object-detail-sidebar__sticky--scrolled'
			);
		});

		it('expands again when the sentinel returns and the container can scroll', () => {
			const { container } = renderSidebar();
			setOverflow(container, true);
			reportSentinel(false);

			reportSentinel(true);

			expect(isCollapsed()).toBe(false);
		});

		it('stays collapsed when the sentinel returns only because a short tab clamped its scroll', () => {
			const { container } = renderSidebar();
			setOverflow(container, false);
			reportSentinel(false);

			reportSentinel(true);

			expect(isCollapsed()).toBe(true);
		});

		it('stops observing on unmount', () => {
			const { unmount } = renderSidebar();

			unmount();

			expect(disconnect).toHaveBeenCalled();
		});
	});

	describe('expanding through the header', () => {
		it('expands and scrolls instantly to the top', () => {
			const { container } = renderSidebar();
			reportSentinel(false);

			fireEvent.click(screen.getByRole('button', { name: 'toon details' }));

			expect(isCollapsed()).toBe(false);
			expect(container.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
		});
	});

	describe('scroll-up intent on a tab without a scrollbar', () => {
		it('expands the collapsed header on wheel up', () => {
			const { container } = renderSidebar();
			setOverflow(container, false);
			reportSentinel(false);

			fireEvent.wheel(container, { deltaY: -10 });

			expect(isCollapsed()).toBe(false);
		});

		it('ignores wheel down', () => {
			const { container } = renderSidebar();
			setOverflow(container, false);
			reportSentinel(false);

			fireEvent.wheel(container, { deltaY: 10 });

			expect(isCollapsed()).toBe(true);
		});

		it('leaves native scrolling to the browser when the container can scroll', () => {
			const { container } = renderSidebar();
			setOverflow(container, true);
			reportSentinel(false);

			fireEvent.wheel(container, { deltaY: -10 });

			expect(isCollapsed()).toBe(true);
		});

		it('expands on a downward swipe', () => {
			const { container } = renderSidebar();
			setOverflow(container, false);
			reportSentinel(false);

			fireEvent.touchStart(container, { touches: [{ clientY: 100 }] });
			fireEvent.touchMove(container, { touches: [{ clientY: 140 }] });

			expect(isCollapsed()).toBe(false);
		});

		it('ignores an upward swipe', () => {
			const { container } = renderSidebar();
			setOverflow(container, false);
			reportSentinel(false);

			fireEvent.touchStart(container, { touches: [{ clientY: 140 }] });
			fireEvent.touchMove(container, { touches: [{ clientY: 100 }] });

			expect(isCollapsed()).toBe(true);
		});

		it('never prevents the default scrolling', () => {
			const { container } = renderSidebar();
			setOverflow(container, false);
			reportSentinel(false);

			const event = createEvent.wheel(container, { deltaY: -10 });
			fireEvent(container, event);

			expect(event.defaultPrevented).toBe(false);
		});
	});

	describe('tab switch', () => {
		it('keeps a collapsed header collapsed by resting 1px below the top', () => {
			const { container, rerender } = renderSidebar();
			reportSentinel(false);
			(container.scrollTo as ReturnType<typeof vi.fn>).mockClear();

			rerender(
				<ObjectDetailPageSidebar
					mediaInfo={undefined}
					onClickAction={vi.fn()}
					hasAccessToVisitorSpaceOfObject={false}
					currentPageIndex={0}
					onReadMoreClicked={vi.fn()}
					activeTab={ObjectDetailTabs.Ocr}
					similar={[]}
					tabs={null}
					containerRef={{ current: container }}
					isProgrammaticScrollRef={{ current: false }}
				>
					{null}
				</ObjectDetailPageSidebar>
			);

			expect(container.scrollTo).toHaveBeenCalledWith({ top: 1, behavior: 'auto' });
		});
	});
});
