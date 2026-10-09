import type { ActiveAiInterval, AiEntity } from '@ie-objects/utils/map-ai-entities';
import { useEffect, useState } from 'react';

/** The entity whose card is open: the filtered one, or the one of the active interval */
export const useSelectedAiEntity = (
	entities: AiEntity[],
	activeInterval: ActiveAiInterval | null,
	initialSelectedId: string | null
) => {
	// The overview tab is unmounted while the media tab shows (mobile): reopen the card of the active interval
	const [selectedId, setSelectedId] = useState<string | null>(() =>
		activeInterval && entities.some((entity) => entity.id === activeInterval.entity.id)
			? activeInterval.entity.id
			: initialSelectedId
	);

	// The entities arrive after the first render, so the filtered one opens when it shows up
	useEffect(() => {
		if (initialSelectedId) {
			setSelectedId(initialSelectedId);
		}
	}, [initialSelectedId]);

	// An interval that is restored later (after a refresh) opens its card too
	const activeEntityId = activeInterval?.entity.id;
	useEffect(() => {
		if (entities.some((entity) => entity.id === activeEntityId)) {
			setSelectedId(activeEntityId ?? null);
		}
	}, [activeEntityId, entities]);

	const selectedEntity = entities.find((entity) => entity.id === selectedId) ?? null;

	return { setSelectedId, selectedEntity };
};
