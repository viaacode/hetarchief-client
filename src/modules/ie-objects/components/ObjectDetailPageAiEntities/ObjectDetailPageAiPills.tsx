import Metadata from '@ie-objects/components/Metadata/Metadata';
import { AiEntityCard } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityCard';
import { AiEntityPillRow } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityPillRow';
import { ObjectDetailPageMetadataDisclaimerTooltip } from '@ie-objects/components/ObjectDetailPageMetadataTab/ObjectDetailPageMetadataDisclaimerTooltip';
import { useSelectedAiEntity } from '@ie-objects/hooks/use-selected-ai-entity';
import type { ActiveAiInterval, AiEntity } from '@ie-objects/utils/map-ai-entities';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { getSearchLink } from '@shared/helpers/get-search-link';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { SearchFilterId } from '@visitor-space/types';
import { type FC, type ReactNode, useId } from 'react';

import styles from './ObjectDetailPageAiPills.module.scss';

export interface ObjectDetailPageAiPillsProps {
	/** Places or organisations, shown as one pill each */
	entities: AiEntity[];
	/** Label of the field with the counter, e.g. "11 plaatsen" */
	title: string;
	/** Search filter the card's search link filters on */
	searchFilterId: SearchFilterId;
	/** Full length of the AV item, the width of the timeline */
	durationSeconds: number | null;
	/** False without access to the essence: the timeline and pills are display only */
	isTimelineInteractive: boolean;
	/** The interval highlighted across all entity types */
	activeInterval: ActiveAiInterval | null;
	/** Highlights the interval and moves the player to it */
	onSelectInterval: (entity: AiEntity, intervalIndex: number) => void;
	/** Explains that the entities are AI generated; set per entity type by the caller */
	disclaimer: ReactNode;
	disclaimerAriaLabel: string;
	/** Entity whose card opens as soon as it is known, e.g. the one filtered on in the search page */
	initialSelectedId?: string | null;
}

export const ObjectDetailPageAiPills: FC<ObjectDetailPageAiPillsProps> = ({
	entities,
	title,
	searchFilterId,
	durationSeconds,
	isTimelineInteractive,
	activeInterval,
	onSelectInterval,
	disclaimer,
	disclaimerAriaLabel,
	initialSelectedId = null,
}) => {
	const locale = useLocale();
	const cardId = useId();
	const { setSelectedId, selectedEntity } = useSelectedAiEntity(
		entities,
		activeInterval,
		initialSelectedId
	);

	if (!entities.length) {
		return null;
	}

	return (
		<Metadata
			key={`ai-${searchFilterId}`}
			title={title}
			renderedTitleRight={
				<ObjectDetailPageMetadataDisclaimerTooltip
					iconName={IconNamesLight.Ai}
					position="top-end"
					ariaLabel={disclaimerAriaLabel}
					content={disclaimer}
				/>
			}
		>
			<div className={styles['c-object-detail-page-ai-pills']}>
				<AiEntityPillRow
					entities={entities}
					selectedId={selectedEntity?.id ?? null}
					controlsId={cardId}
					onSelect={(entityId) =>
						setSelectedId((current) => (current === entityId ? null : entityId))
					}
				/>
				{selectedEntity && (
					<AiEntityCard
						key={selectedEntity.id}
						id={cardId}
						entity={selectedEntity}
						durationSeconds={durationSeconds}
						isInteractive={isTimelineInteractive}
						searchLink={getSearchLink(locale, { [searchFilterId]: selectedEntity.name })}
						activeIntervalIndex={
							activeInterval?.entity.id === selectedEntity.id ? activeInterval.intervalIndex : null
						}
						onSelectInterval={(intervalIndex) => onSelectInterval(selectedEntity, intervalIndex)}
					/>
				)}
			</div>
		</Metadata>
	);
};
