import Metadata from '@ie-objects/components/Metadata/Metadata';
import { AiEntityAvatarRow } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityAvatarRow';
import { AiEntityCard } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityCard';
import { ObjectDetailPageMetadataDisclaimerTooltip } from '@ie-objects/components/ObjectDetailPageMetadataTab/ObjectDetailPageMetadataDisclaimerTooltip';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { getSearchLink } from '@shared/helpers/get-search-link';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { SearchFilterId } from '@visitor-space/types';
import { type FC, type ReactNode, useId, useState } from 'react';

import styles from './ObjectDetailPageAiPersons.module.scss';

export interface ObjectDetailPageAiPersonsProps {
	persons: AiEntity[];
	/** Full length of the AV item, the width of the timeline */
	durationSeconds: number | null;
	/** False without access to the essence: the timeline and pills are display only */
	isTimelineInteractive: boolean;
	onSeek: (seconds: number) => void;
	/** Explains that the persons are AI generated; set per entity type by the caller */
	disclaimer: ReactNode;
	disclaimerAriaLabel: string;
	/** Person whose card is open from the start, e.g. the one filtered on in the search page */
	initialSelectedId?: string | null;
}

export const ObjectDetailPageAiPersons: FC<ObjectDetailPageAiPersonsProps> = ({
	persons,
	durationSeconds,
	isTimelineInteractive,
	onSeek,
	disclaimer,
	disclaimerAriaLabel,
	initialSelectedId = null,
}) => {
	const locale = useLocale();
	const cardId = useId();
	const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
	const selectedPerson = persons.find((person) => person.id === selectedId) ?? null;

	if (!persons.length) {
		return null;
	}

	return (
		<Metadata
			key="ai-persons"
			title={`${persons.length} ${
				persons.length === 1
					? tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/object-detail-page-ai-persons___persoon'
						)
					: tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/object-detail-page-ai-persons___personen'
						)
			}`}
			renderedTitleRight={
				<ObjectDetailPageMetadataDisclaimerTooltip
					iconName={IconNamesLight.Ai}
					position="top-end"
					ariaLabel={disclaimerAriaLabel}
					content={disclaimer}
				/>
			}
		>
			<div className={styles['c-object-detail-page-ai-persons']}>
				<AiEntityAvatarRow
					entities={persons}
					selectedId={selectedPerson?.id ?? null}
					controlsId={cardId}
					onSelect={(personId) =>
						setSelectedId((current) => (current === personId ? null : personId))
					}
				/>
				{selectedPerson && (
					<AiEntityCard
						key={selectedPerson.id}
						id={cardId}
						entity={selectedPerson}
						durationSeconds={durationSeconds}
						isInteractive={isTimelineInteractive}
						searchLink={getSearchLink(locale, {
							[SearchFilterId.MentionPerson]: selectedPerson.name,
						})}
						onSeek={onSeek}
					/>
				)}
			</div>
		</Metadata>
	);
};
