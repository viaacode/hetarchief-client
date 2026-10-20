import { type FileMention, FileMentionEntityType } from '@ie-objects/ie-objects.types';
import { formatDuration } from '@meemoo/react-components';

export interface AiEntityInterval {
	/** TC-in in seconds */
	start: number;
	/** TC-out in seconds, equal to start for point recognitions (e.g. NER on a transcript) */
	end: number;
}

export interface AiEntity {
	id: string;
	type: FileMentionEntityType;
	name: string;
	wikidataId: string | null;
	wikidataUrl: string | null;
	/** Reference still from ai.meemoo.be, persons only */
	still: string | null;
	/** Sorted by TC-in */
	intervals: AiEntityInterval[];
}

/** The one interval that is highlighted across all entity types, and shown in the mobile player bar */
export interface ActiveAiInterval {
	entity: AiEntity;
	/** Index into entity.intervals */
	intervalIndex: number;
}

// Unique by TC-in and TC-out: the same span can be reported by several annotation types
const mapOccurrencesToIntervals = (mention: FileMention): AiEntityInterval[] => {
	const intervalsByKey = new Map<string, AiEntityInterval>();
	for (const occurrence of mention.occurrences) {
		if (typeof occurrence.startTime !== 'number') {
			continue;
		}
		const start = occurrence.startTime;
		const end = Math.max(start, occurrence.endTime ?? start);
		intervalsByKey.set(`${start}-${end}`, { start, end });
	}
	return [...intervalsByKey.values()].sort((a, b) => a.start - b.start || a.end - b.end);
};

/**
 * Entities of one type, in the order they first appear in the file. Entities without a single
 * timed occurrence can't be placed chronologically, so they go last.
 */
export const mapFileMentionsToAiEntities = (
	mentions: FileMention[],
	type: FileMentionEntityType
): AiEntity[] => {
	return mentions
		.filter((mention) => mention.type === type)
		.map(
			(mention): AiEntity => ({
				id: mention.id,
				type,
				name: mention.name,
				wikidataId: mention.wikidataId,
				wikidataUrl: mention.wikidataUrl,
				still: type === FileMentionEntityType.PERSON ? mention.thumbnailUrl : null,
				intervals: mapOccurrencesToIntervals(mention),
			})
		)
		.sort(
			(a, b) =>
				(a.intervals[0]?.start ?? Number.POSITIVE_INFINITY) -
				(b.intervals[0]?.start ?? Number.POSITIVE_INFINITY)
		);
};

/**
 * Entities the search was filtered on come first, so a match is never hidden behind "Toon meer".
 * Both groups keep their chronological order.
 */
export const prioritizeAiEntitiesByName = (
	entities: AiEntity[],
	filteredNames: readonly (string | null)[] | null | undefined
): AiEntity[] => {
	if (!filteredNames?.length) {
		return entities;
	}
	const isFiltered = (entity: AiEntity) => filteredNames.includes(entity.name);
	return [...entities.filter(isFiltered), ...entities.filter((entity) => !isFiltered(entity))];
};

// mm:ss, or hh:mm:ss from an hour on
export const formatAiEntityTimestamp = (seconds: number): string =>
	formatDuration(Math.floor(seconds), { includeHours: 'auto' });

// TC-out is only shown when it differs from TC-in. Compared on the displayed second, so a NER hit
// that spans a fraction of a second doesn't render as "00:12 ··· 00:12".
export const getAiEntityIntervalLabels = (
	interval: AiEntityInterval
): { start: string; end: string | null } => {
	const start = formatAiEntityTimestamp(interval.start);
	const end = formatAiEntityTimestamp(interval.end);
	return { start, end: end === start ? null : end };
};
