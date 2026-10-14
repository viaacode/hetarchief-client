import { describe, expect, it } from 'vitest';

import { getAiEntityTimelineSegments } from './get-ai-entity-timeline-segments';

// 100s over 1000px = 10px per second
const options = { durationSeconds: 100, barWidthPx: 1000, minWidthPx: 20, mergeGapPx: 5 };

describe('getAiEntityTimelineSegments', () => {
	it('positions segments proportionally to the duration', () => {
		const [segment] = getAiEntityTimelineSegments([{ start: 10, end: 30 }], options);

		expect(segment).toEqual({ leftPercent: 10, widthPercent: 20, intervalIndices: [0] });
	});

	it('widens point recognitions to the minimum width', () => {
		const [segment] = getAiEntityTimelineSegments([{ start: 50, end: 50 }], options);

		expect(segment.widthPercent).toBe(2);
	});

	it('keeps the minimum width inside the bar at the very end', () => {
		const [segment] = getAiEntityTimelineSegments([{ start: 100, end: 100 }], options);

		expect(segment.leftPercent + segment.widthPercent).toBeLessThanOrEqual(100);
		expect(segment.widthPercent).toBe(2);
	});

	it('merges segments that are closer than the merge gap, without losing the intervals', () => {
		// 10-20s ends at 200px, the next starts at 202px: a 2px gap
		const segments = getAiEntityTimelineSegments(
			[
				{ start: 10, end: 20 },
				{ start: 20.2, end: 30 },
				{ start: 60, end: 70 },
			],
			options
		);

		expect(segments).toHaveLength(2);
		expect(segments[0].intervalIndices).toEqual([0, 1]);
		expect(segments[0].leftPercent).toBe(10);
		expect(segments[0].widthPercent).toBe(20);
		expect(segments[1].intervalIndices).toEqual([2]);
	});

	it('returns nothing without a usable duration or bar width', () => {
		expect(
			getAiEntityTimelineSegments([{ start: 1, end: 2 }], { ...options, durationSeconds: 0 })
		).toEqual([]);
		expect(
			getAiEntityTimelineSegments([{ start: 1, end: 2 }], { ...options, barWidthPx: 0 })
		).toEqual([]);
	});
});
