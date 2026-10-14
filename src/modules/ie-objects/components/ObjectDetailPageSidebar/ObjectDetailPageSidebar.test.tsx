import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, type RefObject } from 'react';

import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The header has its own dependencies (store, router, permissions); only its collapse contract matters here
vi.mock('@ie-objects/components/ObjectDetailPageHeader/ObjectDetailPageHeader', () => ({
	ObjectDetailPageHeader: ({
		isCollapsed,
		onShowDetails,
		onCollapseOffsetChange,
	}: {
		isCollapsed: boolean;
		onShowDetails: () => void;
		onCollapseOffsetChange: (offset: number) => void;
	}) => (
		<div data-testid="header" data-collapsed={String(isCollapsed)}>
			<button type="button" onClick={onShowDetails}>
				toon details
			</button>
			<button type="button" onClick={() => onCollapseOffsetChange(120)}>
				report offset
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
			{...overrides}
		>
			<div data-testid="content" />
		</ObjectDetailPageSidebar>
	);
	const container = containerRef.current as HTMLDivElement;
	container.scrollTo = vi.fn() as unknown as typeof container.scrollTo;
	return { ...utils, containerRef, container };
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
			>
				{null}
			</ObjectDetailPageSidebar>
		);
		expect(container).not.toHaveClass('c-object-detail-sidebar__content--ends-in-list');
	});

	it('removes the bottom padding for the related tab, which always ends in its card list', () => {
		const { container } = renderSidebar({ activeTab: ObjectDetailTabs.Related });

		expect(container).toHaveClass('c-object-detail-sidebar__content--ends-in-list');
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

		it('expands again when the sentinel returns', () => {
			renderSidebar();
			reportSentinel(false);

			reportSentinel(true);

			expect(isCollapsed()).toBe(false);
		});

		it('places the sentinel and pins the sticky unit at the reported collapse offset', () => {
			const { container } = renderSidebar();
			const sentinel = container.firstElementChild as HTMLElement;
			const sticky = screen.getByTestId('header').parentElement as HTMLElement;

			fireEvent.click(screen.getByRole('button', { name: 'report offset' }));

			expect(sentinel.style.top).toBe('120px');
			expect(sticky.style.top).toBe('-120px');
		});

		it('stops observing on unmount', () => {
			const { unmount } = renderSidebar();

			unmount();

			expect(disconnect).toHaveBeenCalled();
		});
	});

	describe('expanding through the header', () => {
		it('scrolls smoothly to the top', () => {
			vi.stubGlobal('matchMedia', () => ({ matches: false }));
			const { container } = renderSidebar();

			fireEvent.click(screen.getByRole('button', { name: 'toon details' }));

			expect(container.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
		});

		it('scrolls instantly when reduced motion is preferred', () => {
			vi.stubGlobal('matchMedia', () => ({ matches: true }));
			const { container } = renderSidebar();

			fireEvent.click(screen.getByRole('button', { name: 'toon details' }));

			expect(container.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
		});
	});

	describe('tab switch', () => {
		const rerenderWithTab = (
			rerender: (ui: React.ReactElement) => void,
			container: HTMLDivElement,
			activeTab: ObjectDetailTabs
		) =>
			rerender(
				<ObjectDetailPageSidebar
					mediaInfo={undefined}
					onClickAction={vi.fn()}
					hasAccessToVisitorSpaceOfObject={false}
					currentPageIndex={0}
					onReadMoreClicked={vi.fn()}
					activeTab={activeTab}
					similar={[]}
					tabs={null}
					containerRef={{ current: container }}
				>
					{null}
				</ObjectDetailPageSidebar>
			);

		it('starts the new tab at its own top, 1px past the sentinel, when the header is collapsed', () => {
			const { container, rerender } = renderSidebar();
			fireEvent.click(screen.getByRole('button', { name: 'report offset' }));
			reportSentinel(false);
			(container.scrollTo as ReturnType<typeof vi.fn>).mockClear();

			rerenderWithTab(rerender, container, ObjectDetailTabs.Ocr);

			expect(container.scrollTo).toHaveBeenCalledWith({ top: 121, behavior: 'auto' });
		});

		it('rests 1px below the top on the media tab, which has no header to scroll away', () => {
			const { container, rerender } = renderSidebar({ activeTab: ObjectDetailTabs.Ocr });
			fireEvent.click(screen.getByRole('button', { name: 'report offset' }));
			reportSentinel(false);
			(container.scrollTo as ReturnType<typeof vi.fn>).mockClear();

			rerenderWithTab(rerender, container, ObjectDetailTabs.Media);

			expect(container.scrollTo).toHaveBeenCalledWith({ top: 1, behavior: 'auto' });
		});

		it('leaves the scroll position alone when the header is expanded', () => {
			const { container, rerender } = renderSidebar();
			(container.scrollTo as ReturnType<typeof vi.fn>).mockClear();

			rerenderWithTab(rerender, container, ObjectDetailTabs.Ocr);

			expect(container.scrollTo).not.toHaveBeenCalled();
		});
	});
});
