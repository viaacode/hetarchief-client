import { AiEntityPortrait } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityPortrait';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { Tooltip, TooltipContent, TooltipTrigger } from '@meemoo/react-components';
import { tText } from '@shared/helpers/translate';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import clsx from 'clsx';
import { type FC, useLayoutEffect, useRef, useState } from 'react';

import styles from './AiEntityAvatarRow.module.scss';

// Mirror the avatar size and gap in AiEntityAvatarRow.module.scss / AiEntityPortrait.module.scss.
// The "+N" circle is the same size as an avatar.
const AVATAR_SIZE_PX = 40;
const GAP_PX = 8;

export interface AiEntityAvatarRowProps {
	entities: AiEntity[];
	selectedId: string | null;
	/** Id of the card the avatars open */
	controlsId: string;
	onSelect: (entityId: string) => void;
}

export const AiEntityAvatarRow: FC<AiEntityAvatarRowProps> = ({
	entities,
	selectedId,
	controlsId,
	onSelect,
}) => {
	const rowRef = useRef<HTMLDivElement>(null);
	const [rowWidthPx, setRowWidthPx] = useState(0);
	const [isExpanded, setIsExpanded] = useState(false);

	useLayoutEffect(() => {
		const row = rowRef.current;
		if (!row) {
			return;
		}
		setRowWidthPx(row.getBoundingClientRect().width);
		const observer = new ResizeObserver(([entry]) => setRowWidthPx(entry.contentRect.width));
		observer.observe(row);
		return () => observer.disconnect();
	}, []);

	const fitsInOneRow =
		rowWidthPx === 0 ||
		entities.length * AVATAR_SIZE_PX + (entities.length - 1) * GAP_PX <= rowWidthPx;
	// n avatars and the toggle: (n + 1) * size + n * gap <= row width
	const avatarsNextToToggle = Math.max(
		1,
		Math.floor((rowWidthPx - AVATAR_SIZE_PX) / (AVATAR_SIZE_PX + GAP_PX))
	);
	const visibleCount = isExpanded || fitsInOneRow ? entities.length : avatarsNextToToggle;
	const showToggle = !fitsInOneRow;

	// A selected person hidden behind the "+N" toggle (e.g. opened from a search filter) must be visible
	const selectedIndex = entities.findIndex((entity) => entity.id === selectedId);
	// Depends on the measured numbers too: on the first render the row width is still unknown
	useLayoutEffect(() => {
		if (selectedIndex >= avatarsNextToToggle && !fitsInOneRow) {
			setIsExpanded(true);
		}
	}, [selectedIndex, avatarsNextToToggle, fitsInOneRow]);

	const showMoreLabel = tText(
		'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-avatar-row___toon-meer'
	);
	const showLessLabel = tText(
		'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-avatar-row___toon-minder'
	);

	return (
		<div
			ref={rowRef}
			className={clsx(styles['c-ai-entity-avatar-row'], {
				[styles['c-ai-entity-avatar-row--expanded']]: isExpanded,
			})}
		>
			{entities.slice(0, visibleCount).map((entity) => {
				const isSelected = entity.id === selectedId;
				return (
					<NoServerSideRendering key={entity.id}>
						<Tooltip position="top" offset={10}>
							<TooltipTrigger>
								<button
									type="button"
									className={clsx(styles['c-ai-entity-avatar-row__avatar'], {
										[styles['c-ai-entity-avatar-row__avatar--selected']]: isSelected,
									})}
									aria-label={entity.name}
									aria-expanded={isSelected}
									aria-controls={controlsId}
									onClick={() => onSelect(entity.id)}
								>
									<AiEntityPortrait name={entity.name} still={entity.still} size="sm" />
								</button>
							</TooltipTrigger>
							<TooltipContent>{entity.name}</TooltipContent>
						</Tooltip>
					</NoServerSideRendering>
				);
			})}

			{showToggle && !isExpanded && (
				<NoServerSideRendering>
					<Tooltip position="top" offset={10}>
						<TooltipTrigger>
							<button
								type="button"
								className={styles['c-ai-entity-avatar-row__more']}
								aria-label={showMoreLabel}
								aria-expanded={false}
								onClick={() => setIsExpanded(true)}
							>
								{`+${entities.length - visibleCount}`}
							</button>
						</TooltipTrigger>
						<TooltipContent>{showMoreLabel}</TooltipContent>
					</Tooltip>
				</NoServerSideRendering>
			)}

			{showToggle && isExpanded && (
				<button
					type="button"
					className={styles['c-ai-entity-avatar-row__less']}
					aria-expanded
					onClick={() => setIsExpanded(false)}
				>
					{showLessLabel}
				</button>
			)}
		</div>
	);
};
