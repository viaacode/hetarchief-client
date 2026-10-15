import { act, type RenderResult, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';

import { dynamicActionMenuMock } from './__mocks__/dynamic-action-menu';
import DynamicActionMenu from './DynamicActionMenu';
import { SECONDARY_ITEM_ATTRIBUTE } from './DynamicActionMenu.const';
import type { DynamicActionMenuProps } from './DynamicActionMenu.types';

vi.mock('@shared/helpers/translate', () => ({ tText: (key: string) => key }));

const PRIMARY_WIDTH = 200;
const ITEM_WIDTH = 48;
const GAP = 8;
const HIDDEN_CLASS = 'c-dynamic-action-menu__secondary-item--hidden';

// The mock has 5 secondary actions. Widths next to the primary action that leave room for all of
// them, for 2 buttons plus the dropdown button, and for 1 button plus the dropdown button.
const ALL_VISIBLE_WIDTH = PRIMARY_WIDTH + 5 * ITEM_WIDTH + 4 * GAP;
const TWO_VISIBLE_WIDTH = PRIMARY_WIDTH + 2 * (ITEM_WIDTH + GAP) + ITEM_WIDTH;
const ONE_VISIBLE_WIDTH = PRIMARY_WIDTH + (ITEM_WIDTH + GAP) + ITEM_WIDTH;

// jsdom has no layout, so the sizes the component measures are supplied here
const layout = { containerWidth: 700, itemWidth: ITEM_WIDTH };
let resizeCallbacks: ResizeObserverCallback[] = [];

const getRect = function (this: HTMLElement): DOMRect {
	let width = 0;
	if (this.tagName === 'UL') {
		width = layout.containerWidth;
	} else if (this.hasAttribute(SECONDARY_ITEM_ATTRIBUTE)) {
		// The measured width includes the padding that makes the gap to the next button
		width = layout.itemWidth ? layout.itemWidth + GAP : 0;
	} else if (this.className.includes('primary-item')) {
		width = PRIMARY_WIDTH;
	}
	return { width } as DOMRect;
};

// Async so the client-only tooltips and their positioning settle inside act
const renderMenu = async (props: Partial<DynamicActionMenuProps> = {}) => {
	let result!: RenderResult;
	await act(async () => {
		result = render(<DynamicActionMenu {...dynamicActionMenuMock} {...props} />);
	});
	return result;
};

const resize = async (containerWidth: number) => {
	layout.containerWidth = containerWidth;
	await act(async () => {
		for (const callback of resizeCallbacks) {
			callback([], {} as ResizeObserver);
		}
	});
};

// Focus also triggers the client-only tooltips, which update state
const focus = async (element?: HTMLElement | null) => {
	await act(async () => {
		element?.focus();
	});
};

const getItems = (container: HTMLElement) =>
	Array.from(container.querySelectorAll<HTMLElement>(`[${SECONDARY_ITEM_ATTRIBUTE}]`));

const getVisibleItems = (container: HTMLElement) =>
	getItems(container).filter((item) => !item.classList.contains(HIDDEN_CLASS));

const getItemButton = (container: HTMLElement, index: number) =>
	getItems(container)[index].querySelector('button') as HTMLButtonElement;

const getDropdownButton = (container: HTMLElement) =>
	container.querySelector<HTMLElement>('button[aria-controls]');

describe('Components', () => {
	describe('<DynamicActionMenu />', () => {
		beforeEach(() => {
			layout.containerWidth = 700;
			layout.itemWidth = ITEM_WIDTH;
			resizeCallbacks = [];

			vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(getRect);
			vi.spyOn(window, 'getComputedStyle').mockReturnValue({
				paddingRight: `${GAP}px`,
			} as CSSStyleDeclaration);
			vi.stubGlobal(
				'ResizeObserver',
				class {
					constructor(callback: ResizeObserverCallback) {
						resizeCallbacks.push(callback);
					}
					observe() {}
					unobserve() {}
					disconnect() {}
				}
			);
		});

		afterEach(() => {
			vi.restoreAllMocks();
			vi.unstubAllGlobals();
		});

		it('Should set the correct class name', async () => {
			const className = 'custom class name';
			const { container } = await renderMenu({ className });

			expect(container.firstChild).toHaveClass(className);
		});

		it('Should render every action', async () => {
			const { container } = await renderMenu();

			expect(container.querySelectorAll('button')).toHaveLength(
				dynamicActionMenuMock.actions.length
			);
		});

		it('Should show every secondary action and no dropdown when they all fit', async () => {
			layout.containerWidth = ALL_VISIBLE_WIDTH;
			const { container } = await renderMenu();

			expect(getVisibleItems(container)).toHaveLength(5);
			expect(getDropdownButton(container)).not.toBeInTheDocument();
		});

		it('Should hide the actions that do not fit, but keep them in the DOM, and add the dropdown', async () => {
			layout.containerWidth = TWO_VISIBLE_WIDTH;
			const { container } = await renderMenu();

			expect(getItems(container)).toHaveLength(5);
			expect(getVisibleItems(container)).toEqual(getItems(container).slice(0, 2));
			expect(getDropdownButton(container)).toBeInTheDocument();
		});

		it('Should handle having no secondary actions', async () => {
			const { container } = await renderMenu({
				actions: dynamicActionMenuMock.actions.slice(0, 1),
			});

			expect(getItems(container)).toHaveLength(0);
			expect(getDropdownButton(container)).not.toBeInTheDocument();
		});

		it('Should update when the container is resized', async () => {
			const { container } = await renderMenu();
			expect(getDropdownButton(container)).not.toBeInTheDocument();

			await resize(TWO_VISIBLE_WIDTH);
			expect(getVisibleItems(container)).toHaveLength(2);
			expect(getDropdownButton(container)).toBeInTheDocument();

			await resize(700);
			expect(getVisibleItems(container)).toHaveLength(5);
			expect(getDropdownButton(container)).not.toBeInTheDocument();
		});

		it('Should measure again once buttons that were not mounted yet get a width', async () => {
			layout.containerWidth = TWO_VISIBLE_WIDTH;
			layout.itemWidth = 0;
			const { container } = await renderMenu();

			// Nothing to measure yet, so nothing is moved into the dropdown
			expect(getVisibleItems(container)).toHaveLength(5);

			layout.itemWidth = ITEM_WIDTH;
			await resize(layout.containerWidth);
			expect(getVisibleItems(container)).toHaveLength(2);
		});

		it('Should only measure again when a relevant size changed', async () => {
			layout.containerWidth = TWO_VISIBLE_WIDTH;
			const { container } = await renderMenu();
			// Measuring toggles the list's modifier class
			let classChanges = 0;
			const observer = new MutationObserver((records) => {
				classChanges += records.length;
			});
			observer.observe(container.firstElementChild as Element, {
				attributes: true,
				attributeFilter: ['class'],
			});

			await resize(layout.containerWidth);
			expect(classChanges).toBe(0);

			await resize(layout.containerWidth - 10);
			expect(classChanges).toBeGreaterThan(0);
			observer.disconnect();
		});

		it('Should keep the dropdown mounted while measuring again', async () => {
			layout.containerWidth = TWO_VISIBLE_WIDTH;
			const { container } = await renderMenu();
			const dropdownButton = getDropdownButton(container);

			await resize(layout.containerWidth - 10);

			expect(getDropdownButton(container)).toBe(dropdownButton);
		});

		it('Should measure again when the actions change', async () => {
			layout.containerWidth = TWO_VISIBLE_WIDTH;
			const { container, rerender } = await renderMenu();
			expect(getVisibleItems(container)).toHaveLength(2);

			rerender(
				<DynamicActionMenu
					{...dynamicActionMenuMock}
					actions={dynamicActionMenuMock.actions.slice(0, 3)}
				/>
			);

			// The dropdown is no longer needed once the remaining 2 buttons fit
			expect(getItems(container)).toHaveLength(2);
			expect(getVisibleItems(container)).toHaveLength(2);
			expect(getDropdownButton(container)).not.toBeInTheDocument();
		});

		it('Should not measure again when only the identity of the actions changes', async () => {
			layout.containerWidth = TWO_VISIBLE_WIDTH;
			const { container, rerender } = await renderMenu();
			let classChanges = 0;
			const observer = new MutationObserver((records) => {
				classChanges += records.length;
			});
			observer.observe(container.firstElementChild as Element, {
				attributes: true,
				attributeFilter: ['class'],
			});

			await act(async () => {
				rerender(
					<DynamicActionMenu
						{...dynamicActionMenuMock}
						actions={dynamicActionMenuMock.actions.map((action) => ({ ...action }))}
					/>
				);
			});

			expect(classChanges).toBe(0);
			expect(getVisibleItems(container)).toHaveLength(2);
			observer.disconnect();
		});

		it('Should call the onClickAction callback when a button is clicked', async () => {
			const onClickAction = vi.fn();
			const { container } = await renderMenu({ onClickAction });

			act(() => {
				container.querySelector('button')?.click();
			});

			expect(onClickAction).toHaveBeenCalledTimes(1);
			expect(onClickAction).toHaveBeenCalledWith(dynamicActionMenuMock.actions[0].id);
		});

		describe('focus', () => {
			it('Should hand focus to the dropdown button when the focused button moves into the dropdown', async () => {
				const { container } = await renderMenu();
				await focus(getItemButton(container, 3));

				await resize(TWO_VISIBLE_WIDTH);

				expect(document.activeElement).toBe(getDropdownButton(container));
			});

			it('Should keep focus on a button that stays visible', async () => {
				const { container } = await renderMenu();
				const button = getItemButton(container, 0);
				await focus(button);

				await resize(TWO_VISIBLE_WIDTH);

				expect(document.activeElement).toBe(button);
			});

			it('Should continue on the first button that became visible when the dropdown disappears', async () => {
				layout.containerWidth = TWO_VISIBLE_WIDTH;
				const { container } = await renderMenu();
				await focus(getDropdownButton(container));

				await resize(700);

				expect(getDropdownButton(container)).not.toBeInTheDocument();
				expect(document.activeElement).toBe(getItemButton(container, 2));
			});

			it('Should keep focus on the dropdown button while the dropdown stays', async () => {
				layout.containerWidth = TWO_VISIBLE_WIDTH;
				const { container } = await renderMenu();
				const dropdownButton = getDropdownButton(container);
				await focus(dropdownButton);

				await resize(ONE_VISIBLE_WIDTH);

				expect(document.activeElement).toBe(dropdownButton);
			});

			it('Should hand focus to the dropdown button when the open flyout is rebuilt', async () => {
				layout.containerWidth = TWO_VISIBLE_WIDTH;
				const { container } = await renderMenu();
				await act(async () => {
					getDropdownButton(container)?.click();
				});
				await focus(container.querySelector<HTMLElement>('.c-menu__item'));
				expect(document.activeElement).toHaveClass('c-menu__item');

				// One more button moves into the dropdown, which changes what the flyout lists
				await resize(ONE_VISIBLE_WIDTH);

				expect(document.activeElement).toBe(getDropdownButton(container));
			});

			it('Should not reopen the dropdown after it disappeared while open', async () => {
				layout.containerWidth = TWO_VISIBLE_WIDTH;
				const { container } = await renderMenu();
				await act(async () => {
					getDropdownButton(container)?.click();
				});
				expect(getDropdownButton(container)).toHaveAttribute('aria-expanded', 'true');

				await resize(700);
				expect(getDropdownButton(container)).not.toBeInTheDocument();

				await resize(TWO_VISIBLE_WIDTH);
				expect(getDropdownButton(container)).toHaveAttribute('aria-expanded', 'false');
			});

			it('Should leave focus outside the menu alone', async () => {
				const { container } = await renderMenu();
				const outside = document.createElement('button');
				document.body.append(outside);
				await focus(outside);

				await resize(TWO_VISIBLE_WIDTH);

				expect(getDropdownButton(container)).toBeInTheDocument();
				expect(document.activeElement).toBe(outside);
				outside.remove();
			});
		});

		describe('server rendering', () => {
			it('Should not render the measuring layout before it can measure', () => {
				const html = renderToString(<DynamicActionMenu {...dynamicActionMenuMock} />);

				expect(html).not.toContain('c-dynamic-action-menu--measuring');
				expect(html.split(SECONDARY_ITEM_ATTRIBUTE)).toHaveLength(6);
				expect(html).not.toContain('secondary-item--hidden');
			});

			it('Should still measure on the first render in the browser', async () => {
				layout.containerWidth = TWO_VISIBLE_WIDTH;
				const { container } = await renderMenu();

				expect(container.firstElementChild).not.toHaveClass('c-dynamic-action-menu--measuring');
				expect(getVisibleItems(container)).toHaveLength(2);
			});
		});

		describe('hiding an action', () => {
			// The first 2 buttons stay visible at TWO_VISIBLE_WIDTH, so the last 3 move into the dropdown
			const withOnHide = (onHide: () => void, index: number) =>
				dynamicActionMenuMock.actions.map((action, actionIndex) =>
					actionIndex === index ? { ...action, onHide } : action
				);

			it('Should call onHide once when the action moves into the dropdown', async () => {
				const onHide = vi.fn();
				await renderMenu({ actions: withOnHide(onHide, 5) });
				expect(onHide).not.toHaveBeenCalled();

				await resize(TWO_VISIBLE_WIDTH);
				expect(onHide).toHaveBeenCalledTimes(1);

				await resize(TWO_VISIBLE_WIDTH - 1);
				await resize(TWO_VISIBLE_WIDTH);
				expect(onHide).toHaveBeenCalledTimes(1);
			});

			it('Should call onHide again when the action was visible in between', async () => {
				const onHide = vi.fn();
				await renderMenu({ actions: withOnHide(onHide, 5) });

				await resize(TWO_VISIBLE_WIDTH);
				await resize(700);
				await resize(TWO_VISIBLE_WIDTH);

				expect(onHide).toHaveBeenCalledTimes(2);
			});

			it('Should not call onHide for an action that stays visible', async () => {
				const onHide = vi.fn();
				await renderMenu({ actions: withOnHide(onHide, 1) });

				await resize(TWO_VISIBLE_WIDTH);

				expect(onHide).not.toHaveBeenCalled();
			});
		});

		describe('accessibility', () => {
			it('Should give a primary action the full label as title, unless it has a tooltip', async () => {
				const [primary, ...secondary] = dynamicActionMenuMock.actions;
				const { container, rerender } = await renderMenu();
				const getPrimaryButton = () =>
					container.querySelector('.c-dynamic-action-menu__primary-item button');

				expect(getPrimaryButton()).toHaveAttribute('title', primary.label);

				await act(async () => {
					rerender(
						<DynamicActionMenu
							{...dynamicActionMenuMock}
							actions={[{ ...primary, tooltip: 'Tooltip' }, ...secondary]}
						/>
					);
				});
				expect(getPrimaryButton()).toHaveAttribute('title', 'Tooltip');
			});

			it('Should tell the state and the flyout of the dropdown button, without promising a menu', async () => {
				layout.containerWidth = TWO_VISIBLE_WIDTH;
				const { container } = await renderMenu();
				const dropdownButton = getDropdownButton(container) as HTMLElement;

				expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
				// The flyout is a list of buttons, not a role="menu"
				expect(dropdownButton).not.toHaveAttribute('aria-haspopup');
				const flyoutId = dropdownButton.getAttribute('aria-controls') as string;
				expect(flyoutId).toBe(`dynamic-action-menu--${dynamicActionMenuMock.id}`);
				expect(container.querySelector(`#${flyoutId}`)).toBeInTheDocument();

				await act(async () => {
					dropdownButton.click();
				});
				expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');
			});

			it('Should not repeat the tooltip text in a title on buttons that show a tooltip', async () => {
				const { container } = await renderMenu();

				for (const item of getItems(container)) {
					expect(item.querySelector('button')).not.toHaveAttribute('title');
				}
			});
		});
	});
});
