import { AdvancedFilterFormState } from '@reading-room/components';
import { ReadingRoomFilterId } from '@reading-room/types';
import { SEARCH_QUERY_KEY } from '@shared/const';

import { mapFiltersToQuery, mapFiltersToTags } from './map-filters';

describe('Utils', () => {
	describe('mapFiltersToTags()', () => {
		it('should map search query to tags', () => {
			const query = {
				[SEARCH_QUERY_KEY]: ['test1', 'test2'],
				format: '',
				start: 0,
			};
			const filters = mapFiltersToTags(query);

			expect(filters).toHaveLength(query.search.length);
			expect(filters[0].value).toBe(query.search[0]);
		});

		it('Should filter out falsey search values', () => {
			const value = 'test';
			const query = {
				[SEARCH_QUERY_KEY]: [null, value],
				format: '',
				start: 0,
			};
			const filters = mapFiltersToTags(query);

			expect(filters).toHaveLength(1);
			expect(filters[0].value).toBe(value);
		});
	});

	describe('mapFiltersToQuery()', () => {
		it('Should map advanced filter to query', () => {
			const advancedFilter: AdvancedFilterFormState = {
				advanced: [{ metadataProp: 'title', operator: 'equals', value: 'value' }],
			};
			const parsedQueryValue = mapFiltersToQuery(
				ReadingRoomFilterId.Advanced,
				advancedFilter
			);

			expect(parsedQueryValue).toHaveLength(advancedFilter.advanced.length);
			expect(parsedQueryValue?.[0].prop).toBe(advancedFilter.advanced[0].metadataProp);
			expect(parsedQueryValue?.[0].op).toBe(advancedFilter.advanced[0].operator);
			expect(parsedQueryValue?.[0].val).toBe(advancedFilter.advanced[0].value);
		});
	});
});
