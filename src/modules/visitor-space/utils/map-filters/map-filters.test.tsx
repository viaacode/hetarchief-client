import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';

import { mapFiltersToTags, tagPrefix } from './map-filters';

describe('Utils', () => {
	describe('mapFiltersToTags()', () => {
		it('should map search query to tags', () => {
			const query = {
				[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: ['test1', 'test2'],
				format: '',
				start: 0,
			};
			const filters = mapFiltersToTags(query);

			expect(filters).toHaveLength(query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY].length);
			expect(filters[0].value).toBe(
				tagPrefix(QUERY_PARAM_KEY.SEARCH_QUERY_KEY) +
					query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY][0]
			);
		});

		it('Should filter out falsey search values', () => {
			const value = 'test';
			const query = {
				[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: [null, value],
				format: '',
				start: 0,
			};
			const filters = mapFiltersToTags(query);

			expect(filters).toHaveLength(1);
			expect(filters[0].value).toBe(tagPrefix(QUERY_PARAM_KEY.SEARCH_QUERY_KEY) + value);
		});
	});
});
