import { mapFilters } from './map-filters';

describe('Utils', () => {
	describe('mapFilters()', () => {
		it('should map search query', () => {
			const query = {
				search: ['test1', 'test2'],
			};
			const filters = mapFilters(query);

			expect(filters).toHaveLength(query.search.length);
			expect(filters[0].value).toBe(query.search[0]);
		});

		it('Should filter out falsey search values', () => {
			const value = 'test';
			const query = {
				search: [null, value],
			};
			const filters = mapFilters(query);

			expect(filters).toHaveLength(1);
			expect(filters[0].value).toBe(value);
		});
	});
});
