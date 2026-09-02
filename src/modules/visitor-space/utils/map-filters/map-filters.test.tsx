import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import type { FilterMenuFilterOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { FilterMenuType } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// The test setup loads no translations, so a key would render as an empty string.
// Render the readable tail of the key instead, so a pill's wording stays checkable.
vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
	tHtml: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
}));

import { FilterModalType, FilterProperty, Operator, SearchFilterId } from '../../types';
import { mapFiltersToTags, tagPrefix } from './map-filters';

const filter = (
	id: SearchFilterId,
	modalType: FilterModalType,
	label: string,
	field: IeObjectsSearchFilterField
): FilterMenuFilterOption => ({
	id,
	label,
	field,
	modalType,
	type: FilterMenuType.Modal,
	inMainPanelByDefault: false,
	tabs: [],
});

const GENRE_FILTER = filter(
	SearchFilterId.Genre,
	FilterModalType.SearchableCheckbox,
	'Genre',
	IeObjectsSearchFilterField.GENRE
);
const TITLE_FILTER = filter(
	SearchFilterId.Title,
	FilterModalType.Text,
	'Titel',
	IeObjectsSearchFilterField.NAME
);
const MAINTAINERS_FILTER = filter(
	SearchFilterId.Maintainers,
	FilterModalType.SearchableCheckbox,
	'Aanbieder',
	IeObjectsSearchFilterField.MAINTAINER_ID
);

const THEME_FILTER = filter(
	SearchFilterId.Theme,
	FilterModalType.SearchableCheckbox,
	'Thema',
	IeObjectsSearchFilterField.THEME
);

const asText = (tagLabel: unknown): string =>
	renderToStaticMarkup(tagLabel as React.ReactElement).replace(/<[^>]*>/g, '');

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

		it('should label the theme filter with the theme name in the language of the UI', () => {
			const tags = mapFiltersToTags(
				{ [SearchFilterId.Theme]: ['education-learning'] },
				[THEME_FILTER],
				{ themeLabelsBySlug: { 'education-learning': 'Onderwijs en leren' } }
			);

			expect(tags).toHaveLength(1);
			// Only the slug travels through the url, so the same url can be labelled in either language
			expect(asText(tags[0].label)).toContain('Onderwijs en leren');
		});

		it('should label a theme filter of an url from before ARC-3806', () => {
			const tags = mapFiltersToTags(
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
				[],
				{ themeLabelsBySlug: { 'education-learning': 'Onderwijs en leren' } }
			);

			expect(tags).toHaveLength(1);
			expect(asText(tags[0].label)).toContain('Onderwijs en leren');
		});

		it('should fall back to the theme slug when the themes are not loaded yet', () => {
			const tags = mapFiltersToTags({ [SearchFilterId.Theme]: ['education-learning'] }, [
				THEME_FILTER,
			]);

			expect(asText(tags[0].label)).toContain('education-learning');
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

		// The "Redesign pills" section of the FA of ARC-3806
		it('gives one filter with one value one pill', () => {
			const tags = mapFiltersToTags({ [SearchFilterId.Genre]: ['concert'] }, [GENRE_FILTER]);

			expect(tags).toHaveLength(1);
			expect(asText(tags[0].label)).toEqual('Genre is: concert');
		});

		it('gathers every value of one filter in one pill, alphabetically, with a counter', () => {
			const tags = mapFiltersToTags({ [SearchFilterId.Genre]: ['dans', 'concert', 'drama'] }, [
				GENRE_FILTER,
			]);

			expect(tags).toHaveLength(1);
			expect(asText(tags[0].label)).toEqual('Genre is: concert, dans, +1');
		});

		it('shows the label half of a value that carries its own label', () => {
			const tags = mapFiltersToTags(
				{ [SearchFilterId.Maintainers]: ['OR-1---VRT', 'OR-2---Amsab-ISG'] },
				[MAINTAINERS_FILTER]
			);

			expect(asText(tags[0].label)).toEqual('Aanbieder is: Amsab-ISG, VRT');
		});

		it('writes "bevat" on a text filter pill', () => {
			const tags = mapFiltersToTags(
				{
					[SearchFilterId.Title]: [
						{ op: Operator.CONTAINS, val: 'Magriet Hermans' },
						{ op: Operator.CONTAINS, val: 'Luc Appermont' },
						{ op: Operator.CONTAINS, val: 'Sabine' },
						{ op: Operator.CONTAINS, val: 'Walter' },
					],
				},
				[TITLE_FILTER]
			);

			expect(tags).toHaveLength(1);
			expect(asText(tags[0].label)).toEqual('Titel bevat: Luc Appermont, Magriet Hermans, +2');
		});

		it('keeps "bevat" and "bevat niet" in pills of their own', () => {
			const tags = mapFiltersToTags(
				{
					[SearchFilterId.Title]: [
						{ op: Operator.CONTAINS, val: 'concert' },
						{ op: Operator.CONTAINS_NOT, val: 'herhaling' },
					],
				},
				[TITLE_FILTER]
			);

			expect(tags).toHaveLength(2);
			expect(asText(tags[0].label)).toEqual('Titel bevat: concert');
			expect(asText(tags[1].label)).toEqual('Titel bevat niet: herhaling');
			expect(tags[0].id).not.toEqual(tags[1].id);
		});

		// A search term has no filter modal behind it, so its pill must not offer to open one
		it('marks a search term pill as not clickable, and a filter pill as clickable', () => {
			const [searchTerm] = mapFiltersToTags({ [QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: ['concert'] });
			const [genre] = mapFiltersToTags({ [SearchFilterId.Genre]: ['concert'] }, [GENRE_FILTER]);

			expect(searchTerm.isClickable).toBe(false);
			expect(genre.isClickable).not.toBe(false);
		});

		it('gives a filter without a value no pill', () => {
			expect(mapFiltersToTags({}, [GENRE_FILTER, TITLE_FILTER])).toEqual([]);
		});
	});
});
