import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { render } from '@testing-library/react';
import { FilterProperty, Operator, SearchFilterId } from '@visitor-space/types';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
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
				tagPrefix(QUERY_PARAM_KEY.SEARCH_QUERY_KEY) + query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY][0]
			);
		});

		it('should label an advanced theme filter with the theme name in the language of the UI', () => {
			const filters = mapFiltersToTags(
				{
					[SearchFilterId.Advanced]: [
						{
							prop: FilterProperty.THEME,
							op: Operator.EQUALS,
							val: 'education-learning',
							renderKey: 'theme-filter',
						},
					],
				},
				{ themeLabelsBySlug: { 'education-learning': 'Education & learning' } }
			);

			expect(filters).toHaveLength(1);
			// Only the slug travels through the url, so the same url can be labelled in either language
			expect(render(filters[0].label as ReactElement).container.textContent).toContain(
				'Education & learning'
			);
		});

		it('should fall back to the theme slug when the themes are not loaded yet', () => {
			const filters = mapFiltersToTags({
				[SearchFilterId.Advanced]: [
					{
						prop: FilterProperty.THEME,
						op: Operator.EQUALS,
						val: 'education-learning',
						renderKey: 'theme-filter',
					},
				],
			});

			expect(render(filters[0].label as ReactElement).container.textContent).toContain(
				'education-learning'
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
