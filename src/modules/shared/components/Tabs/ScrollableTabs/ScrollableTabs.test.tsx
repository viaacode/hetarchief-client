import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@shared/helpers/translate', () => ({ tText: (key: string) => key }));

import { mockTabs } from '../__mocks__/tabs';
import ScrollableTabs from './ScrollableTabs'; // Mock ResizeObserver used in ScrollableTabs component

// Mock ResizeObserver used in ScrollableTabs component
window.ResizeObserver =
	window.ResizeObserver ||
	class {
		disconnect = vi.fn();
		observe = vi.fn();
		unobserve = vi.fn();
	};

// jsdom doesn't implement Element.scrollTo
Element.prototype.scrollTo = Element.prototype.scrollTo || vi.fn();

// Make sure the container is small enough to create overflow
const containerWidth = 320;
const baseContainer = document.createElement('div');
baseContainer.style.cssText = `max-width: ${containerWidth}px; width: 100%;`;

describe('<ScrollableTabs />', () => {
	const tabsComponent = <ScrollableTabs tabs={mockTabs} />;

	it('Should show correct gradients after scroll', () => {
		const { container } = render(tabsComponent, { container: baseContainer });
		const scrollable = container.querySelector('.c-scrollable-tabs');
		const tabs = container.querySelector('.c-tabs') as HTMLElement;

		// Scroll to far right
		fireEvent.scroll(tabs, { target: { scrollLeft: containerWidth } });
		expect(scrollable).toHaveClass('c-scrollable-tabs c-scrollable-tabs--gradient-left');

		// Scroll to far left
		fireEvent.scroll(tabs, { target: { scrollLeft: -containerWidth } });
		expect(scrollable).toHaveClass('c-scrollable-tabs c-scrollable-tabs--gradient-right');
	});

	describe('nav buttons', () => {
		const leftLabel =
			'modules/shared/components/tabs/scrollable-tabs/scrollable-tabs___scroll-tabs-naar-links';
		const rightLabel =
			'modules/shared/components/tabs/scrollable-tabs/scrollable-tabs___scroll-tabs-naar-rechts';
		const originalScrollWidth = Object.getOwnPropertyDescriptor(
			HTMLElement.prototype,
			'scrollWidth'
		);
		const originalClientWidth = Object.getOwnPropertyDescriptor(
			HTMLElement.prototype,
			'clientWidth'
		);

		// jsdom has no layout: 1000px of tabs in a 300px row
		const mockOverflow = () => {
			Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
				configurable: true,
				get: () => 1000,
			});
			Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
				configurable: true,
				get: () => 300,
			});
		};

		afterEach(() => {
			for (const [prop, original] of [
				['scrollWidth', originalScrollWidth],
				['clientWidth', originalClientWidth],
			] as const) {
				if (original) {
					Object.defineProperty(HTMLElement.prototype, prop, original);
				} else {
					Reflect.deleteProperty(HTMLElement.prototype, prop);
				}
			}
		});

		it('does not render nav buttons by default', () => {
			mockOverflow();
			const { container, queryByLabelText } = render(<ScrollableTabs tabs={mockTabs} />);

			fireEvent.scroll(container.querySelector('.c-tabs') as HTMLElement, {
				target: { scrollLeft: 100 },
			});

			expect(queryByLabelText(leftLabel)).toBeNull();
			expect(queryByLabelText(rightLabel)).toBeNull();
		});

		it('shows only the right button at the start and only the left at the end', () => {
			mockOverflow();
			const { container, queryByLabelText } = render(
				<ScrollableTabs tabs={mockTabs} showNavButtons />
			);
			const tabs = container.querySelector('.c-tabs') as HTMLElement;

			fireEvent.scroll(tabs, { target: { scrollLeft: 0 } });
			expect(queryByLabelText(leftLabel)).toBeNull();
			expect(queryByLabelText(rightLabel)).not.toBeNull();

			// 1000 - 300 = true scroll end
			fireEvent.scroll(tabs, { target: { scrollLeft: 700 } });
			expect(queryByLabelText(leftLabel)).not.toBeNull();
			expect(queryByLabelText(rightLabel)).toBeNull();
		});

		it('tolerates a subpixel remainder at the scroll end', () => {
			mockOverflow();
			const { container, queryByLabelText } = render(
				<ScrollableTabs tabs={mockTabs} showNavButtons />
			);

			fireEvent.scroll(container.querySelector('.c-tabs') as HTMLElement, {
				target: { scrollLeft: 699.6 },
			});

			expect(queryByLabelText(rightLabel)).toBeNull();
		});

		it('moves focus to the other button when the focused one disappears at the scroll end', () => {
			mockOverflow();
			const { container, getByLabelText } = render(
				<ScrollableTabs tabs={mockTabs} showNavButtons />
			);
			const tabs = container.querySelector('.c-tabs') as HTMLElement;
			tabs.scrollTo = vi.fn();

			fireEvent.scroll(tabs, { target: { scrollLeft: 300 } });
			const right = getByLabelText(rightLabel);
			right.focus();
			fireEvent.click(right);
			fireEvent.scroll(tabs, { target: { scrollLeft: 700 } });

			expect(getByLabelText(leftLabel)).toHaveFocus();
		});

		it('scrolls by 80% of the row width when clicked', () => {
			mockOverflow();
			const { container, getByLabelText } = render(
				<ScrollableTabs tabs={mockTabs} showNavButtons />
			);
			const tabs = container.querySelector('.c-tabs') as HTMLElement;
			const scrollTo = vi.fn();
			tabs.scrollTo = scrollTo;

			fireEvent.scroll(tabs, { target: { scrollLeft: 300 } });
			fireEvent.click(getByLabelText(rightLabel));
			expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 540, behavior: 'smooth' });

			fireEvent.click(getByLabelText(leftLabel));
			expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 60, behavior: 'smooth' });
		});

		it('shows the right button when tabs are added after mount', () => {
			// 200px per tab in a 300px row
			Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
				configurable: true,
				get(this: HTMLElement) {
					return this.querySelectorAll('.c-tab').length * 200;
				},
			});
			Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
				configurable: true,
				get: () => 300,
			});
			const { rerender, queryByLabelText } = render(
				<ScrollableTabs tabs={mockTabs.slice(0, 1)} showNavButtons />
			);
			expect(queryByLabelText(rightLabel)).toBeNull();

			rerender(<ScrollableTabs tabs={mockTabs} showNavButtons />);

			expect(queryByLabelText(rightLabel)).not.toBeNull();
		});
	});

	describe('tab resize observation', () => {
		it('observes tabs that are added after mount', () => {
			const observed = new Set<Element>();
			const original = window.ResizeObserver;
			window.ResizeObserver = class {
				disconnect = vi.fn();
				observe = (el: Element) => {
					observed.add(el);
				};
				unobserve = vi.fn();
			} as unknown as typeof ResizeObserver;

			try {
				const { rerender, container } = render(
					<ScrollableTabs tabs={mockTabs.slice(0, 1)} showNavButtons />
				);
				rerender(<ScrollableTabs tabs={mockTabs} showNavButtons />);

				for (const tab of container.querySelectorAll('.c-tab')) {
					expect(observed.has(tab)).toBe(true);
				}
				expect(container.querySelectorAll('.c-tab').length).toBe(mockTabs.length);
			} finally {
				window.ResizeObserver = original;
			}
		});
	});
});
