import {
	type FileMention,
	FileMentionAnnotationType,
	FileMentionEntityType,
} from '@ie-objects/ie-objects.types';
import { describe, expect, it } from 'vitest';

import {
	formatAiEntityTimestamp,
	getAiEntityIntervalLabels,
	mapFileMentionsToAiEntities,
} from './map-ai-entities';

const mention = (overrides: Partial<FileMention>): FileMention => ({
	id: 'id',
	iri: 'iri',
	name: 'Jane Doe',
	type: FileMentionEntityType.PERSON,
	wikidataId: 'Q986532',
	wikidataUrl: 'https://www.wikidata.org/wiki/Q986532',
	thumbnailUrl: 'https://example.com/still.jpg',
	occurrences: [],
	...overrides,
});

const occurrence = (startTime: number | null, endTime: number | null) => ({
	startTime,
	endTime,
	confidence: 0.9,
	annotationType: FileMentionAnnotationType.FACE,
	isAiGenerated: true,
});

describe('mapFileMentionsToAiEntities', () => {
	it('only returns entities of the requested type', () => {
		const result = mapFileMentionsToAiEntities(
			[
				mention({ id: 'a', occurrences: [occurrence(1, 2)] }),
				mention({ id: 'b', type: FileMentionEntityType.PLACE, occurrences: [occurrence(1, 2)] }),
				mention({ id: 'c', type: null, occurrences: [occurrence(1, 2)] }),
			],
			FileMentionEntityType.PERSON
		);

		expect(result.map((entity) => entity.id)).toEqual(['a']);
	});

	it('drops occurrences without TC-in, and treats a missing TC-out as a point', () => {
		const [entity] = mapFileMentionsToAiEntities(
			[mention({ occurrences: [occurrence(null, 5), occurrence(10, null), occurrence(20, 15)] })],
			FileMentionEntityType.PERSON
		);

		expect(entity.intervals).toEqual([
			{ start: 10, end: 10 },
			{ start: 20, end: 20 },
		]);
	});

	it('flattens occurrences of all annotation types sorted by TC-in', () => {
		const [entity] = mapFileMentionsToAiEntities(
			[
				mention({
					occurrences: [
						occurrence(30, 40),
						{ ...occurrence(5, 8), annotationType: FileMentionAnnotationType.SPEAKER },
						occurrence(5, 6),
					],
				}),
			],
			FileMentionEntityType.PERSON
		);

		expect(entity.intervals).toEqual([
			{ start: 5, end: 6 },
			{ start: 5, end: 8 },
			{ start: 30, end: 40 },
		]);
	});

	it('orders entities by first appearance and puts untimed ones last', () => {
		const result = mapFileMentionsToAiEntities(
			[
				mention({ id: 'untimed', occurrences: [occurrence(null, null)] }),
				mention({ id: 'late', occurrences: [occurrence(50, 60)] }),
				mention({ id: 'early', occurrences: [occurrence(3, 4)] }),
			],
			FileMentionEntityType.PERSON
		);

		expect(result.map((entity) => entity.id)).toEqual(['early', 'late', 'untimed']);
	});

	it('only keeps the still for persons', () => {
		const [place] = mapFileMentionsToAiEntities(
			[mention({ type: FileMentionEntityType.PLACE, occurrences: [occurrence(1, 2)] })],
			FileMentionEntityType.PLACE
		);

		expect(place.still).toBeNull();
	});
});

describe('formatAiEntityTimestamp', () => {
	it('formats as mm:ss below an hour and hh:mm:ss from an hour', () => {
		expect(formatAiEntityTimestamp(36.9)).toBe('00:36');
		expect(formatAiEntityTimestamp(3725)).toBe('01:02:05');
	});
});

describe('getAiEntityIntervalLabels', () => {
	it('hides TC-out when it equals TC-in', () => {
		expect(getAiEntityIntervalLabels({ start: 118, end: 118 })).toEqual({
			start: '01:58',
			end: null,
		});
		expect(getAiEntityIntervalLabels({ start: 118.2, end: 118.8 }).end).toBeNull();
	});

	it('shows TC-out when it differs from TC-in', () => {
		expect(getAiEntityIntervalLabels({ start: 36, end: 66 })).toEqual({
			start: '00:36',
			end: '01:06',
		});
	});
});
