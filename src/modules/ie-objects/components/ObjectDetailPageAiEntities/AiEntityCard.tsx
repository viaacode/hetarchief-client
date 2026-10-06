import { AiEntityIntervalPills } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityIntervalPills';
import { AiEntityPortrait } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityPortrait';
import { AiEntityTimeline } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityTimeline';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import Link from 'next/link';
import { type FC, useState } from 'react';

import styles from './AiEntityCard.module.scss';

export interface AiEntityCardProps {
	entity: AiEntity;
	/** Full length of the AV item, the width of the timeline */
	durationSeconds: number | null;
	/** False without access to the essence: the timeline and pills are display only */
	isInteractive: boolean;
	/** Search page filtered on this entity */
	searchLink: string;
	/** Moves the player to this moment */
	onSeek: (seconds: number) => void;
	id?: string;
	className?: string;
}

export const AiEntityCard: FC<AiEntityCardProps> = ({
	entity,
	durationSeconds,
	isInteractive,
	searchLink,
	onSeek,
	id,
	className,
}) => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const hasIntervals = entity.intervals.length > 0;

	const handleSelect = (intervalIndex: number) => {
		setActiveIndex(intervalIndex);
		onSeek(entity.intervals[intervalIndex].start);
	};

	return (
		<div
			id={id}
			className={clsx(
				styles['c-ai-entity-card'],
				{ [styles['c-ai-entity-card--without-intervals']]: !hasIntervals },
				className
			)}
		>
			<div className={styles['c-ai-entity-card__header']}>
				<AiEntityPortrait name={entity.name} still={entity.still} size="lg" />
				<div className={styles['c-ai-entity-card__title']}>
					<h3 className={styles['c-ai-entity-card__name']}>{entity.name}</h3>
					{entity.wikidataId && (
						<p className={styles['c-ai-entity-card__wikidata']}>
							{tText(
								'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-card___wikidata'
							)}{' '}
							{entity.wikidataUrl ? (
								<a
									className={styles['c-ai-entity-card__wikidata-link']}
									href={entity.wikidataUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									{entity.wikidataId}
								</a>
							) : (
								entity.wikidataId
							)}
						</p>
					)}
				</div>
				<Link
					href={searchLink}
					className={styles['c-ai-entity-card__search']}
					aria-label={tText(
						'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-card___zoek-alle-objecten-met-deze-entiteit'
					)}
				>
					<Icon name={IconNamesLight.SearchObjects} aria-hidden />
				</Link>
			</div>

			{hasIntervals && durationSeconds ? (
				<AiEntityTimeline
					intervals={entity.intervals}
					durationSeconds={durationSeconds}
					activeIndex={activeIndex}
					isInteractive={isInteractive}
					onSelect={handleSelect}
				/>
			) : null}

			{hasIntervals && (
				<AiEntityIntervalPills
					intervals={entity.intervals}
					activeIndex={activeIndex}
					isInteractive={isInteractive}
					onSelect={handleSelect}
				/>
			)}
		</div>
	);
};
