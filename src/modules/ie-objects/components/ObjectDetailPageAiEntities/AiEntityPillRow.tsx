import { getAiEntityPillRowVisibleCount } from '@ie-objects/utils/get-ai-entity-pill-row-layout';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, useLayoutEffect, useRef, useState } from 'react';

import styles from './AiEntityPillRow.module.scss';

// Mirror the gap in AiEntityPillRow.module.scss
const GAP_PX = 8;
const MAX_COLLAPSED_ROWS = 2;

export interface AiEntityPillRowProps {
	entities: AiEntity[];
	selectedId: string | null;
	/** Id of the card the pills open */
	controlsId: string;
	onSelect: (entityId: string) => void;
}

export const AiEntityPillRow: FC<AiEntityPillRowProps> = ({
	entities,
	selectedId,
	controlsId,
	onSelect,
}) => {
	const measureRef = useRef<HTMLDivElement>(null);
	const [collapsedCount, setCollapsedCount] = useState(entities.length);
	const [isExpanded, setIsExpanded] = useState(false);

	// Measured on a hidden copy with every pill, so the visible list can change without feeding back
	// into the measurement
	const pillNames = entities.map((entity) => entity.name).join('\n');
	// biome-ignore lint/correctness/useExhaustiveDependencies: pillNames stands in for the pills that are observed
	useLayoutEffect(() => {
		const measure = measureRef.current;
		if (!measure) {
			return;
		}
		const update = () => {
			const pills = Array.from(measure.querySelectorAll<HTMLElement>('[data-pill]'));
			const toggle = measure.querySelector<HTMLElement>('[data-toggle]');
			setCollapsedCount(
				getAiEntityPillRowVisibleCount({
					pillWidthsPx: pills.map((pill) => Math.ceil(pill.getBoundingClientRect().width)),
					toggleWidthPx: Math.ceil(toggle?.getBoundingClientRect().width ?? 0),
					containerWidthPx: Math.floor(measure.getBoundingClientRect().width),
					gapPx: GAP_PX,
					maxRows: MAX_COLLAPSED_ROWS,
				})
			);
		};
		update();
		// Also fires when the web font arrives and the pills change width
		const observer = new ResizeObserver(update);
		observer.observe(measure);
		for (const element of measure.querySelectorAll('[data-pill], [data-toggle]')) {
			observer.observe(element);
		}
		return () => observer.disconnect();
	}, [pillNames]);

	const hasToggle = collapsedCount < entities.length;
	const visibleCount = isExpanded || !hasToggle ? entities.length : collapsedCount;

	// A selected place hidden behind "Toon meer" (e.g. opened from a search filter) must be visible
	const selectedIndex = entities.findIndex((entity) => entity.id === selectedId);
	// Depends on the measured count too: on the first render nothing is measured yet
	useLayoutEffect(() => {
		if (hasToggle && selectedIndex >= collapsedCount) {
			setIsExpanded(true);
		}
	}, [selectedIndex, collapsedCount, hasToggle]);

	const showMoreLabel = tText(
		'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-pill-row___toon-meer'
	);
	const showLessLabel = tText(
		'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-pill-row___toon-minder'
	);

	return (
		<div className={styles['c-ai-entity-pill-row']}>
			<div className={styles['c-ai-entity-pill-row__list']}>
				{entities.slice(0, visibleCount).map((entity) => {
					const isSelected = entity.id === selectedId;
					return (
						<button
							key={entity.id}
							type="button"
							className={clsx(styles['c-ai-entity-pill-row__pill'], {
								[styles['c-ai-entity-pill-row__pill--selected']]: isSelected,
							})}
							aria-expanded={isSelected}
							aria-controls={controlsId}
							onClick={() => onSelect(entity.id)}
						>
							{entity.name}
						</button>
					);
				})}

				{hasToggle && (
					<button
						type="button"
						className={styles['c-ai-entity-pill-row__toggle']}
						aria-expanded={isExpanded}
						onClick={() => setIsExpanded((current) => !current)}
					>
						{isExpanded ? showLessLabel : showMoreLabel}
					</button>
				)}
			</div>

			<div ref={measureRef} className={styles['c-ai-entity-pill-row__measure']} aria-hidden>
				{entities.map((entity) => (
					<span key={entity.id} data-pill className={styles['c-ai-entity-pill-row__pill']}>
						{entity.name}
					</span>
				))}
				<span data-toggle className={styles['c-ai-entity-pill-row__toggle']}>
					{showMoreLabel}
				</span>
			</div>
		</div>
	);
};
