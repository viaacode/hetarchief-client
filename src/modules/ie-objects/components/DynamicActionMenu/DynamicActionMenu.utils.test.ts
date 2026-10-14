import { afterEach, describe, expect, it, vi } from 'vitest';

import { getItemGap, getItemWidth, getVisibleCount } from './DynamicActionMenu.utils';

const GAP = 8;
const FIVE_BUTTONS = [48, 48, 48, 48, 48];

describe('getVisibleCount', () => {
	// What is left next to the primary action, against 5 buttons of 48px with 8px gaps (272px in
	// total). Once something has to move, the dropdown button takes 48px as well.
	it.each([
		{ available: 400, expected: 5 },
		{ available: 272, expected: 5 },
		{ available: 271, expected: 3 },
		{ available: 160, expected: 2 },
		{ available: 104, expected: 1 },
		{ available: 103, expected: 0 },
		{ available: 0, expected: 0 },
	])('shows $expected of 5 buttons with $available px available', ({ available, expected }) => {
		expect(getVisibleCount(FIVE_BUTTONS, GAP, available)).toBe(expected);
	});

	it('reserves the width of the widest button for the dropdown button', () => {
		expect(getVisibleCount([48, 100, 48, 48], GAP, 250)).toBe(1);
	});

	it('never uses a dropdown for a single button, however little room there is', () => {
		expect(getVisibleCount([48], GAP, 0)).toBe(1);
	});

	it('has nothing to show without buttons', () => {
		expect(getVisibleCount([], GAP, 100)).toBe(0);
	});

	it('shows everything while the buttons have no width yet', () => {
		expect(getVisibleCount([0, 0, 0], GAP, 10)).toBe(3);
	});
});

describe('getItemWidth and getItemGap', () => {
	const createItem = (width: number, paddingRight: string): HTMLElement => {
		const item = document.createElement('div');
		item.style.paddingRight = paddingRight;
		vi.spyOn(item, 'getBoundingClientRect').mockReturnValue({ width } as DOMRect);
		return item;
	};

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('leaves the gap after a button out of its width', () => {
		expect(getItemWidth(createItem(56, '8px'))).toBe(48);
	});

	it('keeps the width of a button without a gap after it', () => {
		expect(getItemWidth(createItem(48, '0px'))).toBe(48);
	});

	it('is never negative, for a button that is not mounted yet', () => {
		expect(getItemWidth(createItem(0, '8px'))).toBe(0);
	});

	it('reads the gap from the first of multiple buttons', () => {
		expect(getItemGap([createItem(56, '8px'), createItem(48, '0px')])).toBe(8);
	});

	it('has no gap with a single button', () => {
		expect(getItemGap([createItem(56, '8px')])).toBe(0);
	});
});
