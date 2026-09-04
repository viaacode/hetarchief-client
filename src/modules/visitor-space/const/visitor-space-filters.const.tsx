// TODO rename this to SEARCH_FILTERS since these are not specific to a visitor space anymore in fase2
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import getConfig from '@shared/config/public-runtime-config';
import { tText } from '@shared/helpers/translate';
import { IeObjectsSearchFilterField, SearchPageMediaType } from '@shared/types/ie-objects';
import { ConsultableMediaFilterForm } from '@visitor-space/components/ConsultableMediaFilterForm/ConsultableMediaFilterForm';
import { ConsultableOnlyOnLocationFilterForm } from '@visitor-space/components/ConsultableOnlyOnLocationFilterForm/ConsultableOnlyOnLocationFilterForm';
import {
	type FilterMenuFilterOption,
	FilterMenuType,
} from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { ReleaseDateFilterForm } from '@visitor-space/components/ReleaseDateFilterForm';
import { GET_REUSABILITY_OPTIONS } from '@visitor-space/components/ReusabilityFilterForm/ReusabilityFilterForm.const';
import { SinglePropertyFilterForm } from '@visitor-space/components/SinglePropertyFilterForm/SinglePropertyFilterForm';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	FilterModalType,
	FilterProperty,
	SearchFilterId,
} from '@visitor-space/types';
import { getFilterLabel } from '@visitor-space/utils/advanced-filters';
import { isNil, sortBy } from 'es-toolkit/compat';

const { publicRuntimeConfig } = getConfig();

const ALL_TABS: SearchPageMediaType[] = [
	SearchPageMediaType.All,
	SearchPageMediaType.Video,
	SearchPageMediaType.Audio,
	SearchPageMediaType.Newspaper,
];

const AUDIO_VIDEO_TABS: SearchPageMediaType[] = [
	SearchPageMediaType.All,
	SearchPageMediaType.Video,
	SearchPageMediaType.Audio,
];

const NEWSPAPER_TABS: SearchPageMediaType[] = [SearchPageMediaType.Newspaper];

/**
 * Every filter of the search page, main panel and advanced fly-out alike.
 *
 * `modalType` follows the "Allocatie per filter" table of the ARC-3806 FA. `inMainPanelByDefault`
 * marks the filters that show without the user picking them from the fly-out first.
 *
 * @param isGlobalArchive is the user currently looking in the global archive or in one specific archive of one maintainer
 * @param isKioskUser
 * @param isKeyUser
 * @param activeTab
 */
export const SEARCH_PAGE_FILTERS = (
	isGlobalArchive: boolean,
	isKioskUser: boolean,
	isKeyUser: boolean,
	activeTab: SearchPageMediaType
): FilterMenuFilterOption[] => {
	const ENABLE_RIGHTS_FILTERS_FOR_EVERYBODY =
		publicRuntimeConfig.ENABLE_RIGHTS_FILTERS_FOR_EVERYBODY === 'true';

	const textFilter = (
		id: SearchFilterId,
		field: IeObjectsSearchFilterField,
		property: FilterProperty
	): FilterMenuFilterOption => ({
		id,
		label: getFilterLabel(property),
		type: FilterMenuType.Modal,
		modalType: FilterModalType.Text,
		field,
		property,
		inMainPanelByDefault: false,
		tabs: ALL_TABS,
	});

	return [
		// The panel shows these by default. Their order is the order of the design, so it is not
		// grouped by modal type the way the rest of this list is.
		{
			id: SearchFilterId.ConsultableMedia,
			label: {
				[SearchPageMediaType.All]: tText(
					'modules/visitor-space/const/index___alles-wat-raadpleegbaar-is'
				),
				[SearchPageMediaType.Video]: tText(
					'modules/visitor-space/const/visitor-space-filters___direct-kijken'
				),
				[SearchPageMediaType.Audio]: tText(
					'modules/visitor-space/const/visitor-space-filters___direct-luisteren'
				),
				[SearchPageMediaType.Newspaper]: tText(
					'modules/visitor-space/const/visitor-space-filters___direct-lezen'
				),
			}[activeTab],
			form: ConsultableMediaFilterForm,
			type: FilterMenuType.Checkbox,
			modalType: FilterModalType.Unchanged,
			field: IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
			inMainPanelByDefault: true,
			tabs: ALL_TABS,
			isDisabled: () => {
				return !isKeyUser && !ENABLE_RIGHTS_FILTERS_FOR_EVERYBODY;
			},
		},
		{
			id: SearchFilterId.ConsultableOnlyOnLocation,
			label: {
				[SearchPageMediaType.All]: tText(
					'modules/visitor-space/const/index___enkel-ter-plaatse-beschikbaar'
				),
				[SearchPageMediaType.Video]: tText(
					'modules/visitor-space/const/visitor-space-filters___ter-plaatse-kijken'
				),
				[SearchPageMediaType.Audio]: tText(
					'modules/visitor-space/const/visitor-space-filters___ter-plaatse-luisteren'
				),
				[SearchPageMediaType.Newspaper]: tText(
					'modules/visitor-space/const/visitor-space-filters___ter-plaatse-lezen'
				),
			}[activeTab],
			form: ConsultableOnlyOnLocationFilterForm,
			type: FilterMenuType.Checkbox,
			modalType: FilterModalType.Unchanged,
			field: IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
			inMainPanelByDefault: true,
			tabs: ALL_TABS,
			isDisabled: () => {
				return isKioskUser;
			},
		},
		{
			id: SearchFilterId.Maintainers,
			label: tText('modules/visitor-space/const/index___aanbieder'),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.SearchableCheckbox,
			field: IeObjectsSearchFilterField.MAINTAINER_ID,
			inMainPanelByDefault: true,
			tabs: ALL_TABS,
			isDisabled: () => {
				return !isGlobalArchive || isKioskUser;
			},
		},
		{
			id: SearchFilterId.NewspaperSeriesName,
			label: tText('modules/visitor-space/const/visitor-space-filters___reeks'),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.Autocomplete,
			field: IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME,
			inMainPanelByDefault: true,
			tabs: NEWSPAPER_TABS,
		},
		{
			id: SearchFilterId.ReleaseDate,
			label: tText('modules/visitor-space/const/visitor-space-filters___uitgavedatum'),
			form: ReleaseDateFilterForm,
			type: FilterMenuType.Modal,
			modalType: FilterModalType.Unchanged,
			field: IeObjectsSearchFilterField.RELEASE_DATE,
			property: FilterProperty.RELEASE_DATE,
			inMainPanelByDefault: true,
			tabs: ALL_TABS,
		},
		{
			id: SearchFilterId.Reusability,
			label: tText('modules/visitor-space/const/visitor-space-filters___herbruikbaarheid'),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.CheckboxList,
			field: IeObjectsSearchFilterField.REUSABILITY,
			options: () =>
				GET_REUSABILITY_OPTIONS().map((option) => ({
					label: option.label,
					value: `${option.key}${FILTER_LABEL_VALUE_DELIMITER}${option.label}`,
				})),
			inMainPanelByDefault: true,
			tabs: ALL_TABS,
			isDisabled: () => {
				return !ENABLE_RIGHTS_FILTERS_FOR_EVERYBODY && !isKeyUser;
			},
		},
		{
			id: SearchFilterId.LocationCreated,
			label: tText('modules/visitor-space/const/visitor-space-filters___plaats-van-uitgave'),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.CheckboxList,
			field: IeObjectsSearchFilterField.LOCATION_CREATED,
			inMainPanelByDefault: true,
			tabs: NEWSPAPER_TABS,
		},
		{
			id: SearchFilterId.Medium,
			label: tText('modules/visitor-space/const/index___analoge-drager'),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.SearchableCheckbox,
			field: IeObjectsSearchFilterField.MEDIUM,
			inMainPanelByDefault: true,
			tabs: AUDIO_VIDEO_TABS,
		},
		{
			id: SearchFilterId.Creator,
			label: getFilterLabel(FilterProperty.CREATOR),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.Autocomplete,
			field: IeObjectsSearchFilterField.CREATOR,
			inMainPanelByDefault: true,
			tabs: AUDIO_VIDEO_TABS,
		},
		{
			id: SearchFilterId.Mentions,
			label: tText('modules/visitor-space/const/visitor-space-filters___namenlijst-gesneuvelden'),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.Autocomplete,
			field: IeObjectsSearchFilterField.MENTIONS,
			inMainPanelByDefault: true,
			tabs: NEWSPAPER_TABS,
		},
		// Reachable through the advanced fly-out, which sorts them alphabetically itself.
		{
			id: SearchFilterId.Genre,
			label: getFilterLabel(FilterProperty.GENRE),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.SearchableCheckbox,
			field: IeObjectsSearchFilterField.GENRE,
			inMainPanelByDefault: false,
			tabs: ALL_TABS,
		},
		{
			id: SearchFilterId.Rights,
			label: getFilterLabel(FilterProperty.RIGHTS),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.SearchableCheckbox,
			field: IeObjectsSearchFilterField.RIGHTS,
			inMainPanelByDefault: false,
			tabs: ALL_TABS,
			isDisabled: () => {
				return !ENABLE_RIGHTS_FILTERS_FOR_EVERYBODY && !isKeyUser;
			},
		},
		{
			id: SearchFilterId.Theme,
			label: getFilterLabel(FilterProperty.THEME),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.SearchableCheckbox,
			field: IeObjectsSearchFilterField.THEME,
			inMainPanelByDefault: false,
			// Themes are only assigned to audio and video objects, not to newspapers, and are not
			// offered to kiosk users: https://meemoo.atlassian.net/browse/ARC-3797
			tabs: AUDIO_VIDEO_TABS,
			isDisabled: () => {
				return isKioskUser;
			},
		},
		{
			id: SearchFilterId.Language,
			label: getFilterLabel(FilterProperty.LANGUAGE),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.CheckboxList,
			field: IeObjectsSearchFilterField.LANGUAGE,
			inMainPanelByDefault: false,
			tabs: ALL_TABS,
		},
		textFilter(SearchFilterId.Title, IeObjectsSearchFilterField.NAME, FilterProperty.TITLE),
		textFilter(
			SearchFilterId.Description,
			IeObjectsSearchFilterField.DESCRIPTION,
			FilterProperty.DESCRIPTION
		),
		textFilter(SearchFilterId.Cast, IeObjectsSearchFilterField.CAST, FilterProperty.CAST),
		textFilter(
			SearchFilterId.Identifier,
			IeObjectsSearchFilterField.IDENTIFIER,
			FilterProperty.IDENTIFIER
		),
		textFilter(
			SearchFilterId.SpacialCoverage,
			IeObjectsSearchFilterField.SPACIAL_COVERAGE,
			FilterProperty.SPACIAL_COVERAGE
		),
		textFilter(
			SearchFilterId.ObjectType,
			IeObjectsSearchFilterField.OBJECT_TYPE,
			FilterProperty.OBJECT_TYPE
		),
		textFilter(
			SearchFilterId.TemporalCoverage,
			IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
			FilterProperty.TEMPORAL_COVERAGE
		),
		textFilter(
			SearchFilterId.Keywords,
			IeObjectsSearchFilterField.KEYWORD,
			FilterProperty.KEYWORDS
		),
		textFilter(
			SearchFilterId.Publisher,
			IeObjectsSearchFilterField.PUBLISHER,
			FilterProperty.PUBLISHER
		),
		{
			id: SearchFilterId.Created,
			label: getFilterLabel(FilterProperty.CREATED_AT),
			form: SinglePropertyFilterForm,
			type: FilterMenuType.Modal,
			modalType: FilterModalType.Unchanged,
			field: IeObjectsSearchFilterField.CREATED,
			property: FilterProperty.CREATED_AT,
			inMainPanelByDefault: false,
			tabs: ALL_TABS,
		},
		{
			id: SearchFilterId.Published,
			label: getFilterLabel(FilterProperty.PUBLISHED_AT),
			form: SinglePropertyFilterForm,
			type: FilterMenuType.Modal,
			modalType: FilterModalType.Unchanged,
			field: IeObjectsSearchFilterField.PUBLISHED,
			property: FilterProperty.PUBLISHED_AT,
			inMainPanelByDefault: false,
			tabs: ALL_TABS,
		},
		{
			id: SearchFilterId.Duration,
			label: getFilterLabel(FilterProperty.DURATION),
			form: SinglePropertyFilterForm,
			type: FilterMenuType.Modal,
			modalType: FilterModalType.Unchanged,
			field: IeObjectsSearchFilterField.DURATION,
			property: FilterProperty.DURATION,
			inMainPanelByDefault: false,
			tabs: AUDIO_VIDEO_TABS,
		},
		// The advanced fly-out itself. Always last in the panel. FilterOption renders its list.
		{
			id: SearchFilterId.Advanced,
			icon: IconNamesLight.DotsHorizontal,
			label: tText('modules/visitor-space/const/index___geavanceerd'),
			type: FilterMenuType.Modal,
			modalType: FilterModalType.Unchanged,
			inMainPanelByDefault: true,
			tabs: ALL_TABS,
		},
	];
};

/**
 * Every filter, with the tab and permission checks left out.
 * For code that needs the elasticsearch field or the modal type of a filter but not its label:
 * a query parameter maps to the same field whoever is looking and whichever tab is open.
 */
export const ALL_SEARCH_FILTERS = (): FilterMenuFilterOption[] =>
	SEARCH_PAGE_FILTERS(true, false, true, SearchPageMediaType.All);

/** The filters a user may reach on this tab, with the ones their account cannot use removed. */
export const getAvailableSearchPageFilters = (
	isGlobalArchive: boolean,
	isKioskUser: boolean,
	isKeyUser: boolean,
	activeTab: SearchPageMediaType
): FilterMenuFilterOption[] =>
	SEARCH_PAGE_FILTERS(isGlobalArchive, isKioskUser, isKeyUser, activeTab).filter(
		({ isDisabled, tabs }) => !isDisabled?.() && tabs.includes(activeTab)
	);

/**
 * The filters the advanced fly-out lists, sorted alphabetically by their translated label.
 * The fly-out holds every filter that opens a modal, including the ones that already sit in the
 * main panel. It does not hold the inline checkboxes, nor the fly-out entry itself.
 */
export const getAdvancedFlyoutFilters = (
	availableFilters: FilterMenuFilterOption[]
): FilterMenuFilterOption[] =>
	sortBy(
		availableFilters.filter(
			(filter) => filter.type === FilterMenuType.Modal && filter.id !== SearchFilterId.Advanced
		),
		(filter) => filter.label.toLowerCase()
	);

/**
 * The filters the panel shows, in the order the design puts them.
 *
 * The filters that belong to the panel come first, in the order of this file. A filter the user
 * added shows underneath them, and "Geavanceerd" stays at the bottom.
 *
 * A filter the user added shows while the url holds a value for it, or while its modal is open.
 * The url alone carries every case the FA of ARC-3806 names: an activated filter survives a tab
 * switch, a trip to a detail page and back, and a url typed by hand, and it leaves the panel in
 * the three ways the FA allows, since all three drop the parameter.
 */
export const ACTIVE_FILTER_PARAM = 'filter';

export const getVisiblePanelFilters = (
	availableFilters: FilterMenuFilterOption[],
	query: Record<string, unknown>
): FilterMenuFilterOption[] => {
	const isAdded = (filter: FilterMenuFilterOption): boolean =>
		!filter.inMainPanelByDefault &&
		(!isNil(query[filter.id]) || query[ACTIVE_FILTER_PARAM] === filter.id);

	return [
		...availableFilters.filter(
			(filter) => filter.inMainPanelByDefault && filter.id !== SearchFilterId.Advanced
		),
		...availableFilters.filter(isAdded),
		...availableFilters.filter((filter) => filter.id === SearchFilterId.Advanced),
	];
};
