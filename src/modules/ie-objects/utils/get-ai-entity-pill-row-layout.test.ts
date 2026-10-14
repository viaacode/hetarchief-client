import { describe, expect, it } from 'vitest';

import { getAiEntityPillRowVisibleCount } from './get-ai-entity-pill-row-layout';

const options = {
	toggleWidthPx: 60,
	containerWidthPx: 100,
	gapPx: 8,
	maxRows: 2,
};

describe('getAiEntityPillRowVisibleCount', () => {
	it('shows every pill when they fit in the maximum number of rows', () => {
		// 2 rows: 40 + 8 + 40 = 88 and 90
		expect(getAiEntityPillRowVisibleCount({ ...options, pillWidthsPx: [40, 40, 90] })).toBe(3);
	});

	it('shows every pill when the container is not measured yet', () => {
		expect(
			getAiEntityPillRowVisibleCount({
				...options,
				containerWidthPx: 0,
				pillWidthsPx: [40, 40, 90],
			})
		).toBe(3);
	});

	it('keeps room for the toggle in the last row', () => {
		// Rows would be [40 40] [90] [90]: 2 rows with the toggle means [40 40] [90 + toggle won't fit]
		expect(getAiEntityPillRowVisibleCount({ ...options, pillWidthsPx: [40, 40, 90, 90, 40] })).toBe(
			2
		);
	});

	it('fits the toggle next to the last visible pill when there is space', () => {
		// [40 40] [30 + 8 + 60 = 98]
		expect(getAiEntityPillRowVisibleCount({ ...options, pillWidthsPx: [40, 40, 30, 90, 90] })).toBe(
			3
		);
	});

	it('shows at least one pill, and clamps a pill wider than the container', () => {
		expect(getAiEntityPillRowVisibleCount({ ...options, pillWidthsPx: [300, 300, 300, 300] })).toBe(
			1
		);
	});
});
