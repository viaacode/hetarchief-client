import { SECONDARY_ITEM_ATTRIBUTE } from './DynamicActionMenu.const';
import type { FocusHandoff } from './DynamicActionMenu.types';

export const getWidth = (element: Element): number => element.getBoundingClientRect().width;

const getPaddingRight = (element: Element): number =>
	Number.parseFloat(getComputedStyle(element).paddingRight) || 0;

// The padding-right is the gap to the next button, which is not part of the button itself
export const getItemWidth = (item: Element): number =>
	Math.max(0, getWidth(item) - getPaddingRight(item));

// The gap only exists between buttons, so it is only readable from a button that has a next one
export const getItemGap = (items: Element[]): number =>
	items.length > 1 ? getPaddingRight(items[0]) : 0;

export const getSecondaryItems = (secondary: HTMLElement): HTMLElement[] =>
	Array.from(secondary.children).filter((child): child is HTMLElement =>
		child.hasAttribute(SECONDARY_ITEM_ATTRIBUTE)
	);

// Hiding a button or removing the dropdown would drop focus to <body>, so it has to be handed to
// an element that stays: the dropdown button, or the index of a secondary button.
export const getFocusHandoff = (
	secondary: HTMLElement,
	dropdownButton: HTMLElement | null,
	oldCount: number,
	newCount: number
): FocusHandoff | null => {
	const active = document.activeElement;
	if (!active || !secondary.contains(active)) {
		return null;
	}

	const items = getSecondaryItems(secondary);
	const activeIndex = items.findIndex((item) => item.contains(active));
	if (activeIndex >= 0) {
		return activeIndex >= newCount ? 'dropdown' : null;
	}

	// Focus is in the dropdown. Without hidden actions it is gone: continue on the first button
	// that took its place
	if (newCount >= items.length) {
		return Math.min(oldCount, items.length - 1);
	}
	// A changed set of hidden actions rebuilds the open flyout, and focus with it
	return active !== dropdownButton && newCount !== oldCount ? 'dropdown' : null;
};

// Everything that decides what fits. Item widths change when their client-only tooltip mounts.
export const getSizeSignature = (list: HTMLElement, secondary: HTMLElement): string =>
	[getWidth(list), ...getSecondaryItems(secondary).map(getItemWidth)].join();

/**
 * How many secondary buttons stay visible, given their widths (without the gap), the gap between
 * them and the width left next to the primary actions. The rest goes into the dropdown button.
 */
export const getVisibleCount = (itemWidths: number[], gap: number, available: number): number => {
	const widest = Math.max(0, ...itemWidths);

	// A single button never gets a dropdown (it would take as much room), and buttons that aren't
	// mounted yet have no width to decide on
	if (itemWidths.length < 2 || !widest) {
		return itemWidths.length;
	}

	const allWidth =
		itemWidths.reduce((sum, width) => sum + width, 0) + gap * (itemWidths.length - 1);
	if (allWidth <= available) {
		return itemWidths.length;
	}

	// Every visible button is followed by a gap and the dropdown button. That one is assumed as
	// wide as the widest button, since it can't be measured while it isn't mounted. A custom
	// secondary element wider than the icon buttons therefore makes this hide more than needed.
	let count = 0;
	let usedWidth = widest;
	while (count < itemWidths.length - 1 && usedWidth + itemWidths[count] + gap <= available) {
		usedWidth += itemWidths[count] + gap;
		count++;
	}
	return count;
};
