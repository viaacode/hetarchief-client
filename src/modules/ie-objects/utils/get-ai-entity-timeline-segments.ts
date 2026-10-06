import type { AiEntityInterval } from '@ie-objects/utils/map-ai-entities';

export interface AiEntityTimelineSegment {
	/** Position and size as a percentage of the bar width */
	leftPercent: number;
	widthPercent: number;
	/** Indices (into the sorted intervals) drawn by this segment, more than one when merged */
	intervalIndices: number[];
}

interface TimelineSegmentOptions {
	durationSeconds: number;
	barWidthPx: number;
	/** Narrowest a segment may be drawn, so short recognitions stay visible and clickable */
	minWidthPx: number;
	/** Segments closer together than this are drawn as one */
	mergeGapPx: number;
}

/**
 * Visual only: the intervals themselves (and their pills) are never changed or merged.
 * Expects intervals sorted by start.
 */
export const getAiEntityTimelineSegments = (
	intervals: AiEntityInterval[],
	{ durationSeconds, barWidthPx, minWidthPx, mergeGapPx }: TimelineSegmentOptions
): AiEntityTimelineSegment[] => {
	if (durationSeconds <= 0 || barWidthPx <= 0) {
		return [];
	}

	const pxPerSecond = barWidthPx / durationSeconds;
	const groups: { startPx: number; endPx: number; intervalIndices: number[] }[] = [];

	intervals.forEach((interval, index) => {
		const startPx = Math.min(interval.start * pxPerSecond, barWidthPx - minWidthPx);
		const endPx = Math.min(Math.max(interval.end * pxPerSecond, startPx + minWidthPx), barWidthPx);
		const previous = groups[groups.length - 1];

		if (previous && startPx - previous.endPx < mergeGapPx) {
			previous.endPx = Math.max(previous.endPx, endPx);
			previous.intervalIndices.push(index);
		} else {
			groups.push({ startPx: Math.max(startPx, 0), endPx, intervalIndices: [index] });
		}
	});

	return groups.map((group) => ({
		leftPercent: (group.startPx / barWidthPx) * 100,
		widthPercent: ((group.endPx - group.startPx) / barWidthPx) * 100,
		intervalIndices: group.intervalIndices,
	}));
};
