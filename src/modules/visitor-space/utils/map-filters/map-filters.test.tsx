import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { IeObjectsSearchFilterField, IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { Locale } from '@shared/utils/i18n';
import type { FilterMenuFilterOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { FilterMenuType } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { SearchPageQueryParams } from '@visitor-space/const';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// The test setup loads no translations, so a key would render as an empty string.
// Render the readable tail of the key instead, so a pill's wording stays checkable.
vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
	tHtml: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
}));

import { FilterModalType, SearchFilterId } from '../../types';
import {
	getQueryForRemainingTags,
	type MapFiltersToTagsOptions,
	mapFiltersToTags,
	tagPrefix,
} from './map-filters';

const filter = (
	id: SearchFilterId,
	modalType: FilterModalType | undefined,
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
	FilterModalType.Checkbox,
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
	FilterModalType.Checkbox,
	'Aanbieder',
	IeObjectsSearchFilterField.MAINTAINER_ID
);

const THEME_FILTER = filter(
	SearchFilterId.Theme,
	FilterModalType.Checkbox,
	'Thema',
	IeObjectsSearchFilterField.THEME
);

const CONSULTABLE_MEDIA_FILTER: FilterMenuFilterOption = {
	...filter(
		SearchFilterId.ConsultableMedia,
		undefined,
		'Alles wat raadpleegbaar is',
		IeObjectsSearchFilterField.CONSULTABLE_MEDIA
	),
	type: FilterMenuType.Checkbox,
};

const RELEASE_DATE_FILTER = filter(
	SearchFilterId.ReleaseDate,
	undefined,
	'Uitgavedatum',
	IeObjectsSearchFilterField.RELEASE_DATE
);

/** Every pill is sorted in a language, so the tests name one and override it where it matters. */
const toTags = (
	query: Parameters<typeof mapFiltersToTags>[0],
	filters: FilterMenuFilterOption[] = [],
	options: Partial<MapFiltersToTagsOptions> = {}
) => mapFiltersToTags(query, filters, { locale: Locale.nl, ...options });

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
			const filters = toTags(query);

			expect(filters).toHaveLength(query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY].length);
			expect(filters[0].value).toBe(
				tagPrefix(QUERY_PARAM_KEY.SEARCH_QUERY_KEY) + query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY][0]
			);
		});

		it('should label the theme filter with the theme name in the language of the UI', () => {
			const tags = toTags({ [SearchFilterId.Theme]: ['education-learning'] }, [THEME_FILTER], {
				themeLabelsBySlug: { 'education-learning': 'Onderwijs en leren' },
			});

			expect(tags).toHaveLength(1);
			// Only the slug travels through the url, so the same url can be labelled in either language
			expect(asText(tags[0].label)).toContain('Onderwijs en leren');
		});

		it('should label a theme filter of an url from before ARC-3806', () => {
			const tags = toTags(
				{
					[SearchFilterId.Advanced]: [
						{
							prop: SearchFilterId.Theme,
							op: IeObjectsSearchOperator.IS,
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
			const tags = toTags({ [SearchFilterId.Theme]: ['education-learning'] }, [THEME_FILTER]);

			expect(asText(tags[0].label)).toContain('education-learning');
		});

		it('Should filter out falsey search values', () => {
			const value = 'test';
			const query = {
				[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: [null, value],
				format: '',
				start: 0,
			};
			const filters = toTags(query);

			expect(filters).toHaveLength(1);
			expect(filters[0].value).toBe(tagPrefix(QUERY_PARAM_KEY.SEARCH_QUERY_KEY) + value);
		});

		// The "Redesign pills" section of the FA of ARC-3806
		it('gives one filter with one value one pill', () => {
			const tags = toTags({ [SearchFilterId.Genre]: ['concert'] }, [GENRE_FILTER]);

			expect(tags).toHaveLength(1);
			expect(asText(tags[0].label)).toEqual('Genre: concert');
		});

		it('gathers every value of one filter in one pill, alphabetically, with a counter', () => {
			const tags = toTags({ [SearchFilterId.Genre]: ['dans', 'concert', 'drama'] }, [GENRE_FILTER]);

			expect(tags).toHaveLength(1);
			expect(asText(tags[0].label)).toEqual('Genre: concert, dans, +1');
		});

		// Every checkbox filter drops "is" now that the searchable and plain variants are one. ARC-3806
		it('leaves "is" off a checkbox pill, but keeps it on an autocomplete pill', () => {
			const languageFilter = filter(
				SearchFilterId.Language,
				FilterModalType.Checkbox,
				'Taal',
				IeObjectsSearchFilterField.LANGUAGE
			);
			const creatorFilter = filter(
				SearchFilterId.Creator,
				FilterModalType.Autocomplete,
				'Maker',
				IeObjectsSearchFilterField.CREATOR
			);

			expect(
				asText(toTags({ [SearchFilterId.Language]: ['Nederlands'] }, [languageFilter])[0].label)
			).toEqual('Taal: Nederlands');
			expect(
				asText(toTags({ [SearchFilterId.Creator]: ['Anon'] }, [creatorFilter])[0].label)
			).toEqual('Maker is: Anon');
		});

		it('sorts the values in the language of the ui', () => {
			const tags = toTags({ [SearchFilterId.Genre]: ['Zoo', 'Émile'] }, [GENRE_FILTER], {
				locale: Locale.nl,
			});

			expect(asText(tags[0].label)).toEqual('Genre: Émile, Zoo');
		});

		it('shows the label half of a value that carries its own label', () => {
			const tags = toTags({ [SearchFilterId.Maintainers]: ['OR-1---VRT', 'OR-2---Amsab-ISG'] }, [
				MAINTAINERS_FILTER,
			]);

			expect(asText(tags[0].label)).toEqual('Aanbieder: Amsab-ISG, VRT');
		});

		it('writes "bevat" on a text filter pill', () => {
			const tags = toTags(
				{
					[SearchFilterId.Title]: [
						{ op: IeObjectsSearchOperator.CONTAINS, val: 'Magriet Hermans' },
						{ op: IeObjectsSearchOperator.CONTAINS, val: 'Luc Appermont' },
						{ op: IeObjectsSearchOperator.CONTAINS, val: 'Sabine' },
						{ op: IeObjectsSearchOperator.CONTAINS, val: 'Walter' },
					],
				},
				[TITLE_FILTER]
			);

			expect(tags).toHaveLength(1);
			expect(asText(tags[0].label)).toEqual('Titel bevat: Luc Appermont, Magriet Hermans, +2');
		});

		it('keeps "bevat" and "bevat niet" in pills of their own', () => {
			const tags = toTags(
				{
					[SearchFilterId.Title]: [
						{ op: IeObjectsSearchOperator.CONTAINS, val: 'concert' },
						{ op: IeObjectsSearchOperator.CONTAINS_NOT, val: 'herhaling' },
					],
				},
				[TITLE_FILTER]
			);

			expect(tags).toHaveLength(2);
			expect(asText(tags[0].label)).toEqual('Titel bevat: concert');
			expect(asText(tags[1].label)).toEqual('Titel bevat niet: herhaling');
			expect(tags[0].id).not.toEqual(tags[1].id);
		});

		it('gives a text filter one pill per operator it offers', () => {
			const tags = toTags(
				{
					[SearchFilterId.Title]: [
						{ op: IeObjectsSearchOperator.CONTAINS, val: 'concert' },
						{ op: IeObjectsSearchOperator.CONTAINS_NOT, val: 'herhaling' },
						{ op: IeObjectsSearchOperator.IS, val: 'Nachtwacht' },
						{ op: IeObjectsSearchOperator.IS_NOT, val: 'Journaal' },
					],
				},
				[TITLE_FILTER]
			);

			expect(tags.map((tag) => asText(tag.label))).toEqual([
				'Titel bevat: concert',
				'Titel bevat niet: herhaling',
				'Titel is: Nachtwacht',
				'Titel is niet: Journaal',
			]);
			expect(new Set(tags.map((tag) => tag.id)).size).toBe(4);
		});

		// A search term has no filter modal behind it, so its pill must not offer to open one
		it('marks a search term pill as not clickable, and a filter pill as clickable', () => {
			const [searchTerm] = toTags({ [QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: ['concert'] });
			const [genre] = toTags({ [SearchFilterId.Genre]: ['concert'] }, [GENRE_FILTER]);

			expect(searchTerm.isClickable).toBe(false);
			expect(genre.isClickable).not.toBe(false);
		});

		// Neither of these has a modal behind it either, so neither pill may offer to open one
		it('marks a boolean filter pill and a legacy advanced pill as not clickable', () => {
			const [consultable] = toTags({ [SearchFilterId.ConsultableMedia]: true }, [
				CONSULTABLE_MEDIA_FILTER,
			]);
			const [legacy] = toTags({
				[SearchFilterId.Advanced]: [
					{
						prop: SearchFilterId.Title,
						op: IeObjectsSearchOperator.CONTAINS,
						val: 'concert',
						renderKey: 'legacy-title',
					},
				],
			});

			expect(consultable.isClickable).toBe(false);
			expect(legacy.isClickable).toBe(false);
		});

		// A date filter does have a modal, so its pill keeps opening it
		it('keeps a date filter pill clickable', () => {
			const [releaseDate] = toTags(
				{
					[SearchFilterId.ReleaseDate]: [
						{
							prop: SearchFilterId.ReleaseDate,
							op: IeObjectsSearchOperator.GTE,
							val: '2020-01-01',
							renderKey: 'release-date',
						},
					],
				},
				[RELEASE_DATE_FILTER]
			);

			expect(releaseDate.isClickable).not.toBe(false);
		});

		it('gives a filter without a value no pill', () => {
			expect(toTags({}, [GENRE_FILTER, TITLE_FILTER])).toEqual([]);
		});
	});
});

describe('getQueryForRemainingTags()', () => {
	const IDENTIFIER_FILTER = filter(
		SearchFilterId.Identifier,
		FilterModalType.Text,
		'Identifier',
		IeObjectsSearchFilterField.IDENTIFIER
	);

	/**
	 * A url shared before "identifier" moved to the is operators carries the contains pair. The
	 * pills are keyed on the normalized operator, so the surviving pill has to be matched on that
	 * too -- otherwise removing one pill silently dropped the other pill's conditions as well.
	 */
	it('keeps the conditions of a surviving pill on a url carrying a stale operator', () => {
		const query = {
			[SearchFilterId.Identifier]: [
				{ op: IeObjectsSearchOperator.CONTAINS, val: 'co15bf1dcfb943aee' },
				{ op: IeObjectsSearchOperator.CONTAINS_NOT, val: 'def456' },
			],
		} as unknown as SearchPageQueryParams;

		const tags = mapFiltersToTags(query, [IDENTIFIER_FILTER], { locale: Locale.nl });
		expect(tags).toHaveLength(2);

		// The visitor removes the "is niet" pill, so only the "is" pill survives
		const remaining = tags.filter((tag) => tag.op === IeObjectsSearchOperator.IS);
		const updated = getQueryForRemainingTags(remaining, query, [IDENTIFIER_FILTER]);

		expect(updated[SearchFilterId.Identifier]).toEqual([
			{ op: IeObjectsSearchOperator.CONTAINS, val: 'co15bf1dcfb943aee' },
		]);
	});

	it('keeps only the conditions of the surviving operator when a field offers four', () => {
		const query = {
			[SearchFilterId.Title]: [
				{ op: IeObjectsSearchOperator.CONTAINS, val: 'concert' },
				{ op: IeObjectsSearchOperator.IS, val: 'Nachtwacht' },
				{ op: IeObjectsSearchOperator.IS_NOT, val: 'Journaal' },
			],
		} as unknown as SearchPageQueryParams;

		const tags = mapFiltersToTags(query, [TITLE_FILTER], { locale: Locale.nl });
		const remaining = tags.filter((tag) => tag.op !== IeObjectsSearchOperator.IS);
		const updated = getQueryForRemainingTags(remaining, query, [TITLE_FILTER]);

		expect(updated[SearchFilterId.Title]).toEqual([
			{ op: IeObjectsSearchOperator.CONTAINS, val: 'concert' },
			{ op: IeObjectsSearchOperator.IS_NOT, val: 'Journaal' },
		]);
	});

	it('keeps every value of a filter whose pill holds them all', () => {
		const query = {
			[SearchFilterId.Genre]: ['jazz', 'klassiek'],
		} as unknown as SearchPageQueryParams;

		const tags = mapFiltersToTags(query, [GENRE_FILTER], { locale: Locale.nl });
		const updated = getQueryForRemainingTags(tags, query, [GENRE_FILTER]);

		expect(updated[SearchFilterId.Genre]).toEqual(['jazz', 'klassiek']);
	});

	it('drops a filter whose pills were all removed', () => {
		const query = {
			[SearchFilterId.Title]: [{ op: IeObjectsSearchOperator.CONTAINS, val: 'concert' }],
		} as unknown as SearchPageQueryParams;

		expect(getQueryForRemainingTags([], query, [TITLE_FILTER])).toEqual({});
	});
});
