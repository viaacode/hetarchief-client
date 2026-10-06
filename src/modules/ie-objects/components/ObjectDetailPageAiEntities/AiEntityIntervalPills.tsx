import {
	type AiEntityInterval,
	getAiEntityIntervalLabels,
} from '@ie-objects/utils/map-ai-entities';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './AiEntityIntervalPills.module.scss';

const MAX_ROWS_PER_PAGE = 2;

export interface AiEntityIntervalPillsProps {
	intervals: AiEntityInterval[];
	activeIndex: number | null;
	/** Without access to the essence the pills are only a display: no click, no hover, no active state */
	isInteractive: boolean;
	onSelect: (intervalIndex: number) => void;
}

const PillContent: FC<{ interval: AiEntityInterval }> = ({ interval }) => {
	const { start, end } = getAiEntityIntervalLabels(interval);
	return (
		<>
			<span className={styles['c-ai-entity-interval-pills__start']}>{start}</span>
			{end && (
				<>
					<Icon
						name={IconNamesLight.DotsHorizontal}
						className={styles['c-ai-entity-interval-pills__separator']}
					/>
					<span className={styles['c-ai-entity-interval-pills__end']}>{end}</span>
				</>
			)}
		</>
	);
};

export const AiEntityIntervalPills: FC<AiEntityIntervalPillsProps> = ({
	intervals,
	activeIndex,
	isInteractive,
	onSelect,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const measureRef = useRef<HTMLDivElement>(null);
	// Index of the first pill of every page; a page is what fits in MAX_ROWS_PER_PAGE rows
	const [pageStarts, setPageStarts] = useState<number[]>([0]);
	const [page, setPage] = useState(0);

	// Pages follow from the real wrapping, so they adapt to the card width and to the pill widths
	// biome-ignore lint/correctness/useExhaustiveDependencies: the measuring copy changes with the intervals
	useLayoutEffect(() => {
		const container = containerRef.current;
		const measure = measureRef.current;
		if (!container || !measure) {
			return;
		}
		const calculatePages = () => {
			const starts: number[] = [];
			let rowIndex = -1;
			let previousTop: number | null = null;
			Array.from(measure.children).forEach((pill, index) => {
				const top = (pill as HTMLElement).offsetTop;
				if (top !== previousTop) {
					rowIndex += 1;
					previousTop = top;
					if (rowIndex % MAX_ROWS_PER_PAGE === 0) {
						starts.push(index);
					}
				}
			});
			const nextStarts = starts.length ? starts : [0];
			setPageStarts((current) =>
				current.length === nextStarts.length && current.every((value, i) => value === nextStarts[i])
					? current
					: nextStarts
			);
		};
		calculatePages();
		const observer = new ResizeObserver(calculatePages);
		observer.observe(container);
		return () => observer.disconnect();
	}, [intervals]);

	const pageCount = pageStarts.length;
	const currentPage = Math.min(page, pageCount - 1);
	const pageOfActive =
		activeIndex === null
			? -1
			: pageStarts.reduce(
					(found, start, pageIndex) => (activeIndex >= start ? pageIndex : found),
					0
				);

	// Selecting an interval on the timeline must bring its pill into view
	useEffect(() => {
		if (pageOfActive >= 0) {
			setPage(pageOfActive);
		}
	}, [pageOfActive]);

	const pageStart = pageStarts[currentPage] ?? 0;
	const pageEnd = pageStarts[currentPage + 1] ?? intervals.length;

	return (
		<div
			ref={containerRef}
			className={clsx(styles['c-ai-entity-interval-pills'], {
				[styles['c-ai-entity-interval-pills--without-pagination']]: pageCount <= 1,
			})}
		>
			<div className={styles['c-ai-entity-interval-pills__list']}>
				{intervals.slice(pageStart, pageEnd).map((interval, offset) => {
					const index = pageStart + offset;
					const isActive = index === activeIndex;
					const pillClassName = clsx(styles['c-ai-entity-interval-pills__pill'], {
						[styles['c-ai-entity-interval-pills__pill--active']]: isActive,
						[styles['c-ai-entity-interval-pills__pill--interactive']]: isInteractive,
					});
					if (!isInteractive) {
						return (
							<span key={`${interval.start}-${interval.end}-${index}`} className={pillClassName}>
								<PillContent interval={interval} />
							</span>
						);
					}
					return (
						<button
							key={`${interval.start}-${interval.end}-${index}`}
							type="button"
							className={pillClassName}
							aria-pressed={isActive}
							onClick={() => onSelect(index)}
						>
							<PillContent interval={interval} />
						</button>
					);
				})}
			</div>

			{/* Invisible copy with every pill, only there to measure where the rows wrap */}
			<div ref={measureRef} className={styles['c-ai-entity-interval-pills__measure']} aria-hidden>
				{intervals.map((interval, index) => (
					<span
						key={`${interval.start}-${interval.end}-${index}`}
						className={styles['c-ai-entity-interval-pills__pill']}
					>
						<PillContent interval={interval} />
					</span>
				))}
			</div>

			{pageCount > 1 && (
				<nav
					className={styles['c-ai-entity-interval-pills__pagination']}
					aria-label={tText(
						'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-interval-pills___paginering-van-de-tijdsintervallen'
					)}
				>
					<Button
						className={styles['c-ai-entity-interval-pills__pagination-button']}
						disabled={currentPage === 0}
						onClick={() => setPage(currentPage - 1)}
						variants={['text', 'sm']}
						iconStart={<Icon name={IconNamesLight.ArrowLeft} aria-hidden />}
						label={tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-interval-pills___vorige'
						)}
					/>
					<span className={styles['c-ai-entity-interval-pills__pagination-indicator']}>
						{tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-interval-pills___page-van-pageCount',
							{ page: currentPage + 1, pageCount }
						)}
					</span>
					<Button
						className={styles['c-ai-entity-interval-pills__pagination-button']}
						disabled={currentPage === pageCount - 1}
						onClick={() => setPage(currentPage + 1)}
						variants={['text', 'sm']}
						iconEnd={<Icon name={IconNamesLight.ArrowRight} aria-hidden />}
						label={tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-interval-pills___volgende'
						)}
					/>
				</nav>
			)}
		</div>
	);
};
