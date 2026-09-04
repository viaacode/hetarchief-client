import { IeObjectsSearchFilterField, SearchPageMediaType } from '@shared/types/ie-objects';
import { describe, expect, it, vi } from 'vitest';

import { FilterModalType, SearchFilterId } from '../types';

vi.mock('@visitor-space/components/ConsultableMediaFilterForm/ConsultableMediaFilterForm', () => ({
	ConsultableMediaFilterForm: () => null,
}));
vi.mock(
	'@visitor-space/components/ConsultableOnlyOnLocationFilterForm/ConsultableOnlyOnLocationFilterForm',
	() => ({
		ConsultableOnlyOnLocationFilterForm: () => null,
	})
);
vi.mock('@visitor-space/components/ReleaseDateFilterForm', () => ({
	ReleaseDateFilterForm: () => null,
}));
vi.mock('@visitor-space/components/SinglePropertyFilterForm/SinglePropertyFilterForm', () => ({
	SinglePropertyFilterForm: () => null,
}));
vi.mock('@shared/config/public-runtime-config', () => ({
	default: () => ({
		publicRuntimeConfig: {
			ENABLE_RIGHTS_FILTERS_FOR_EVERYBODY: 'true',
		},
	}),
}));

import {
	getAdvancedFlyoutFilters,
	getAvailableSearchPageFilters,
	getVisiblePanelFilters,
	SEARCH_PAGE_FILTERS,
} from './visitor-space-filters.const';

const ALL_TABS = [
	SearchPageMediaType.All,
	SearchPageMediaType.Video,
	SearchPageMediaType.Audio,
	SearchPageMediaType.Newspaper,
];

/** The "Allocatie per filter" table of the FA of ARC-3806. */
const FA_ALLOCATION_TABLE: [SearchFilterId, FilterModalType][] = [
	[SearchFilterId.Maintainers, FilterModalType.SearchableCheckbox],
	[SearchFilterId.Medium, FilterModalType.SearchableCheckbox],
	[SearchFilterId.Genre, FilterModalType.SearchableCheckbox],
	[SearchFilterId.Rights, FilterModalType.SearchableCheckbox],

	[SearchFilterId.Reusability, FilterModalType.CheckboxList],
	[SearchFilterId.LocationCreated, FilterModalType.CheckboxList],
	[SearchFilterId.Language, FilterModalType.CheckboxList],

	[SearchFilterId.NewspaperSeriesName, FilterModalType.Autocomplete],
	[SearchFilterId.Creator, FilterModalType.Autocomplete],
	[SearchFilterId.Mentions, FilterModalType.Autocomplete],

	[SearchFilterId.Title, FilterModalType.Text],
	[SearchFilterId.Description, FilterModalType.Text],
	[SearchFilterId.Cast, FilterModalType.Text],
	[SearchFilterId.Identifier, FilterModalType.Text],
	[SearchFilterId.SpacialCoverage, FilterModalType.Text],
	[SearchFilterId.ObjectType, FilterModalType.Text],
	[SearchFilterId.TemporalCoverage, FilterModalType.Text],
	[SearchFilterId.Keywords, FilterModalType.Text],
	[SearchFilterId.Publisher, FilterModalType.Text],

	// "Blijft zoals het nu is"
	[SearchFilterId.ConsultableMedia, FilterModalType.Unchanged],
	[SearchFilterId.ConsultableOnlyOnLocation, FilterModalType.Unchanged],
	[SearchFilterId.ReleaseDate, FilterModalType.Unchanged],
	[SearchFilterId.Created, FilterModalType.Unchanged],
	[SearchFilterId.Published, FilterModalType.Unchanged],
	[SearchFilterId.Duration, FilterModalType.Unchanged],
];

describe('SEARCH_PAGE_FILTERS', () => {
	it.each(FA_ALLOCATION_TABLE)(
		'has exactly one entry for %s, with the modal type the FA gives it',
		(id, modalType) => {
			const entries = SEARCH_PAGE_FILTERS(true, false, true, SearchPageMediaType.All).filter(
				(filter) => filter.id === id
			);

			expect(entries).toHaveLength(1);
			expect(entries[0].modalType).toEqual(modalType);
		}
	);

	it('gives every filter that queries elasticsearch a field', () => {
		const filtersWithoutField = SEARCH_PAGE_FILTERS(true, false, true, SearchPageMediaType.All)
			.filter((filter) => filter.id !== SearchFilterId.Advanced)
			.filter((filter) => !filter.field);

		expect(filtersWithoutField).toEqual([]);
	});

	it.each([
		{ isGlobalArchive: true, isKioskUser: false, isKeyUser: false },
		{ isGlobalArchive: true, isKioskUser: false, isKeyUser: true },
		{ isGlobalArchive: false, isKioskUser: true, isKeyUser: false },
	])(
		'should show the reusability filter for all users: %s',
		({ isGlobalArchive, isKioskUser, isKeyUser }) => {
			for (const tab of ALL_TABS) {
				const visibleFilters = getAvailableSearchPageFilters(
					isGlobalArchive,
					isKioskUser,
					isKeyUser,
					tab
				);

				expect(visibleFilters.map(({ id }) => id)).toContain(SearchFilterId.Reusability);
			}
		}
	);

	it('offers the multiselect filters of the FA on the tabs it names', () => {
		const idsPerTab = (tab: SearchPageMediaType) =>
			getAvailableSearchPageFilters(true, false, true, tab).map(({ id }) => id);

		for (const tab of [
			SearchPageMediaType.All,
			SearchPageMediaType.Audio,
			SearchPageMediaType.Video,
		]) {
			expect(idsPerTab(tab)).toContain(SearchFilterId.Creator);
		}

		const newspaperIds = idsPerTab(SearchPageMediaType.Newspaper);
		expect(newspaperIds).toContain(SearchFilterId.NewspaperSeriesName);
		expect(newspaperIds).toContain(SearchFilterId.LocationCreated);
		expect(newspaperIds).toContain(SearchFilterId.Mentions);
		expect(newspaperIds).not.toContain(SearchFilterId.Creator);
	});

	// The theme filter predates ARC-3806 and is not in its allocation table. Its own rules come
	// from ARC-3797: audio and video only, and never for kiosk users.
	describe('the theme filter', () => {
		it('opens a searchable checkbox modal', () => {
			const theme = SEARCH_PAGE_FILTERS(true, false, true, SearchPageMediaType.All).find(
				({ id }) => id === SearchFilterId.Theme
			);

			expect(theme?.modalType).toEqual(FilterModalType.SearchableCheckbox);
			expect(theme?.field).toEqual(IeObjectsSearchFilterField.THEME);
		});

		it('is offered on the audio and video tabs, but not on the newspaper tab', () => {
			const idsPerTab = (tab: SearchPageMediaType) =>
				getAvailableSearchPageFilters(true, false, true, tab).map(({ id }) => id);

			for (const tab of [
				SearchPageMediaType.All,
				SearchPageMediaType.Audio,
				SearchPageMediaType.Video,
			]) {
				expect(idsPerTab(tab)).toContain(SearchFilterId.Theme);
			}
			expect(idsPerTab(SearchPageMediaType.Newspaper)).not.toContain(SearchFilterId.Theme);
		});

		it('is not offered to a kiosk user', () => {
			const ids = getAvailableSearchPageFilters(false, true, false, SearchPageMediaType.All).map(
				({ id }) => id
			);

			expect(ids).not.toContain(SearchFilterId.Theme);
		});
	});
});

describe('getAdvancedFlyoutFilters', () => {
	it.each(ALL_TABS)('sorts the list alphabetically by label on the %s tab', (tab) => {
		const flyoutFilters = getAdvancedFlyoutFilters(
			getAvailableSearchPageFilters(true, false, true, tab)
		);
		const labels = flyoutFilters.map((filter) => filter.label.toLowerCase());

		expect(labels).toEqual([...labels].sort());
	});

	it('holds the filters that are already in the main panel too', () => {
		const flyoutIds = getAdvancedFlyoutFilters(
			getAvailableSearchPageFilters(true, false, true, SearchPageMediaType.All)
		).map((filter) => filter.id);

		// The FA names "maker" as an example of a filter in both places
		expect(flyoutIds).toContain(SearchFilterId.Creator);
		expect(flyoutIds).toContain(SearchFilterId.Maintainers);
		expect(flyoutIds).toContain(SearchFilterId.Genre);
	});

	it('leaves out the inline checkboxes and the fly-out entry itself', () => {
		const flyoutIds = getAdvancedFlyoutFilters(
			getAvailableSearchPageFilters(true, false, true, SearchPageMediaType.All)
		).map((filter) => filter.id);

		expect(flyoutIds).not.toContain(SearchFilterId.Advanced);
		expect(flyoutIds).not.toContain(SearchFilterId.ConsultableMedia);
		expect(flyoutIds).not.toContain(SearchFilterId.ConsultableOnlyOnLocation);
	});
});

describe('getVisiblePanelFilters', () => {
	const availableFilters = () =>
		getAvailableSearchPageFilters(true, false, true, SearchPageMediaType.All);

	const visibleIds = (query: Record<string, unknown>) =>
		getVisiblePanelFilters(availableFilters(), query).map(({ id }) => id);

	it('shows the default filters and nothing more on a bare url', () => {
		const ids = visibleIds({});

		expect(ids).toContain(SearchFilterId.Maintainers);
		expect(ids).toContain(SearchFilterId.Advanced);
		expect(ids).not.toContain(SearchFilterId.Genre);
		expect(ids).not.toContain(SearchFilterId.Title);
	});

	// Flow 1, step 3 of the FA: the row appears before anything is applied
	it('shows a filter while its modal is open', () => {
		expect(visibleIds({ filter: SearchFilterId.Genre })).toContain(SearchFilterId.Genre);
	});

	// Flow 1, step 5: the row survives a tab switch, a detail page, and a url typed by hand
	it('shows a filter the url holds a value for, with its modal closed', () => {
		expect(visibleIds({ [SearchFilterId.Genre]: ['concert'] })).toContain(SearchFilterId.Genre);
	});

	// Flow 1, step 6: removing the pill, resetting, or reloading all clear the parameter
	it('hides a filter again once its parameter is gone', () => {
		expect(visibleIds({ [SearchFilterId.Genre]: undefined })).not.toContain(SearchFilterId.Genre);
	});

	// Flow 2, step 5: a default filter never leaves the panel
	it('keeps a default filter in the panel with and without a value', () => {
		expect(visibleIds({})).toContain(SearchFilterId.Creator);
		expect(visibleIds({ [SearchFilterId.Creator]: undefined })).toContain(SearchFilterId.Creator);
	});

	// The design puts an added filter under the default rows
	it('puts the filters the user added under the default ones', () => {
		const ids = visibleIds({
			[SearchFilterId.Genre]: ['concert'],
			[SearchFilterId.Title]: ['concert'],
		});
		const defaults = visibleIds({}).filter((id) => id !== SearchFilterId.Advanced);

		expect(ids.slice(0, defaults.length)).toEqual(defaults);
		expect(ids.slice(defaults.length)).toEqual([
			SearchFilterId.Genre,
			SearchFilterId.Title,
			SearchFilterId.Advanced,
		]);
	});

	// Flow 1, step 6a: the pill is gone, so the row goes with it, even with the modal open
	it('hides a filter whose value is gone while another filter is open', () => {
		const ids = visibleIds({
			[SearchFilterId.Genre]: undefined,
			filter: SearchFilterId.Title,
		});

		expect(ids).not.toContain(SearchFilterId.Genre);
		expect(ids).toContain(SearchFilterId.Title);
	});

	it('keeps "Geavanceerd" at the bottom', () => {
		const ids = visibleIds({ [SearchFilterId.Genre]: ['concert'] });

		expect(ids[ids.length - 1]).toEqual(SearchFilterId.Advanced);
	});

	it('leaves out a filter that does not belong to this tab', () => {
		const newspaperOnly = getVisiblePanelFilters(
			getAvailableSearchPageFilters(true, false, true, SearchPageMediaType.All),
			{ [SearchFilterId.Mentions]: ['Abel Joseph Riviere'], filter: SearchFilterId.Mentions }
		).map(({ id }) => id);

		expect(newspaperOnly).not.toContain(SearchFilterId.Mentions);
	});
});
