import { SEARCH_QUERY_KEY } from '@shared/const';

import { mapFiltersToTags } from './map-filters';

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
});
