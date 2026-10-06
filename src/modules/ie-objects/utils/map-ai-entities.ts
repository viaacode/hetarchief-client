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

const mapOccurrencesToIntervals = (mention: FileMention): AiEntityInterval[] => {
	return mention.occurrences
		.filter((occurrence) => typeof occurrence.startTime === 'number')
		.map((occurrence) => {
			const start = occurrence.startTime as number;
			const end = occurrence.endTime ?? start;
			return { start, end: Math.max(start, end) };
		})
		.sort((a, b) => a.start - b.start || a.end - b.end);
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
