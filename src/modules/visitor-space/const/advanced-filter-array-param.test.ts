import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { describe, expect, it } from 'vitest';
import { SearchFilterId } from '../types';
import { AdvancedFilterArrayParam, FILTER_NAME_WITH_ACRONYM } from './advanced-filter-array-param';
import { RightsLabel } from './rights-filter.const';

describe('FILTER_NAME_WITH_ACRONYM', () => {
	/**
	 * These two-letter codes are url-visible: they appear in the legacy "advanced" parameter and in
	 * the date and duration parameters of urls people have shared and bookmarked. Changing one
	 * breaks every url that carries it, so the whole table is pinned here rather than spot-checked.
	 */
	it('keeps every acronym pointing at the filter it has always pointed at', () => {
		expect(FILTER_NAME_WITH_ACRONYM).toEqual([
			[SearchFilterId.Cast, 'cs'],
			[SearchFilterId.Created, 'ca'],
			[SearchFilterId.Creator, 'ct'],
			[SearchFilterId.Description, 'de'],
			[SearchFilterId.Duration, 'du'],
			[SearchFilterId.Genre, 'ge'],
			[SearchFilterId.Identifier, 'id'],
			[SearchFilterId.Keywords, 'kw'],
			[SearchFilterId.Language, 'la'],
			[SearchFilterId.Format, 'ty'],
			[SearchFilterId.Medium, 'me'],
			[SearchFilterId.ObjectType, 'ot'],
			[SearchFilterId.Published, 'pa'],
			[SearchFilterId.Publisher, 'pu'],
			[SearchFilterId.ReleaseDate, 'rd'],
			[SearchFilterId.Rights, 'ri'],
			[SearchFilterId.SpacialCoverage, 'sc'],
			[SearchFilterId.TemporalCoverage, 'tc'],
			[SearchFilterId.Theme, 'th'],
			[SearchFilterId.Title, 'ti'],
			[SearchFilterId.NewspaperSeriesName, 'ns'],
			[SearchFilterId.LocationCreated, 'lc'],
			[SearchFilterId.Mentions, 'mn'],
		]);
	});

	it('gives every acronym a unique filter', () => {
		const acronyms = FILTER_NAME_WITH_ACRONYM.map(([, acronym]) => acronym);
		const ids = FILTER_NAME_WITH_ACRONYM.map(([id]) => id);

		expect(new Set(acronyms).size).toBe(acronyms.length);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('AdvancedFilterArrayParam', () => {
	it('should encode and decode rights filters', () => {
		const encoded = AdvancedFilterArrayParam.encode([
			{
				prop: SearchFilterId.Rights,
				op: IeObjectsSearchOperator.IS,
				val: RightsLabel.IN_COPYRIGHT,
				renderKey: 'rights-filter',
			},
		]);

		expect(encoded).toBe(`rieq${encodeURIComponent('https://rightsstatements.org/page/InC/1.0/')}`);
		expect(AdvancedFilterArrayParam.decode(encoded)).toEqual([
			expect.objectContaining({
				prop: SearchFilterId.Rights,
				op: IeObjectsSearchOperator.IS,
				val: RightsLabel.IN_COPYRIGHT,
			}),
		]);
	});

	it('should encode and decode theme filters using the theme slug', () => {
		const encoded = AdvancedFilterArrayParam.encode([
			{
				prop: SearchFilterId.Theme,
				op: IeObjectsSearchOperator.IS,
				val: 'education-learning',
				renderKey: 'theme-filter',
			},
		]);

		expect(encoded).toBe('theqeducation-learning');
		expect(AdvancedFilterArrayParam.decode(encoded)).toEqual([
			expect.objectContaining({
				prop: SearchFilterId.Theme,
				op: IeObjectsSearchOperator.IS,
				val: 'education-learning',
			}),
		]);
	});
});
