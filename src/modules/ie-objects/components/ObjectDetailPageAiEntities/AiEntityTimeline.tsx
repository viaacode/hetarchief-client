import { getAiEntityTimelineSegments } from '@ie-objects/utils/get-ai-entity-timeline-segments';
import { type AiEntityInterval, formatAiEntityTimestamp } from '@ie-objects/utils/map-ai-entities';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, useLayoutEffect, useMemo, useRef, useState } from 'react';

import styles from './AiEntityTimeline.module.scss';

// Mirror the segment size in AiEntityTimeline.module.scss: a point recognition is drawn as a circle
const SEGMENT_MIN_WIDTH_PX = 10;
// Segments closer together than this are drawn as one
const SEGMENT_MERGE_GAP_PX = 2;

export interface AiEntityTimelineProps {
	intervals: AiEntityInterval[];
	durationSeconds: number;
	activeIndex: number | null;
	/** Without access to the essence the bar is only a display: no click, no hover, no active state */
	isInteractive: boolean;
	onSelect: (intervalIndex: number) => void;
}

export const AiEntityTimeline: FC<AiEntityTimelineProps> = ({
	intervals,
	durationSeconds,
	activeIndex,
	isInteractive,
	onSelect,
}) => {
	const trackRef = useRef<HTMLDivElement>(null);
	const [barWidthPx, setBarWidthPx] = useState(0);

	useLayoutEffect(() => {
		const track = trackRef.current;
		if (!track) {
			return;
		}
		setBarWidthPx(track.getBoundingClientRect().width);
		const observer = new ResizeObserver(([entry]) => setBarWidthPx(entry.contentRect.width));
		observer.observe(track);
		return () => observer.disconnect();
	}, []);

	const segments = useMemo(
		() =>
			getAiEntityTimelineSegments(intervals, {
				durationSeconds,
				barWidthPx,
				minWidthPx: SEGMENT_MIN_WIDTH_PX,
				mergeGapPx: SEGMENT_MERGE_GAP_PX,
			}),
		[intervals, durationSeconds, barWidthPx]
	);

	return (
		<div ref={trackRef} className={styles['c-ai-entity-timeline']}>
			{segments.map((segment) => {
				const firstIndex = segment.intervalIndices[0];
				const isActive = activeIndex !== null && segment.intervalIndices.includes(activeIndex);
				const segmentClassName = clsx(styles['c-ai-entity-timeline__segment'], {
					[styles['c-ai-entity-timeline__segment--active']]: isActive,
					[styles['c-ai-entity-timeline__segment--interactive']]: isInteractive,
				});
				const style = { left: `${segment.leftPercent}%`, width: `${segment.widthPercent}%` };

				if (!isInteractive) {
					return <span key={firstIndex} className={segmentClassName} style={style} />;
				}
				return (
					<button
						key={firstIndex}
						type="button"
						className={segmentClassName}
						style={style}
						aria-pressed={isActive}
						aria-label={tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-timeline___spring-naar-timestamp',
							{ timestamp: formatAiEntityTimestamp(intervals[firstIndex].start) }
						)}
						onClick={() => onSelect(firstIndex)}
					/>
				);
			})}
		</div>
	);
};
