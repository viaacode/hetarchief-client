// TODO rename this to SEARCH_FILTERS since these are not specific to a visitor space anymore in fase2
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { SearchPageMediaType } from '@shared/types/ie-objects';
import { AdvancedFilterForm } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm';
import { ConsultableMediaFilterForm } from '@visitor-space/components/ConsultableMediaFilterForm/ConsultableMediaFilterForm';
import { ConsultableOnlyOnLocationFilterForm } from '@visitor-space/components/ConsultableOnlyOnLocationFilterForm/ConsultableOnlyOnLocationFilterForm';
import { ConsultablePublicDomainFilterForm } from '@visitor-space/components/ConsultablePublicDomainFilterForm/ConsultablePublicDomainFilterForm';
import { CreatorFilterForm } from '@visitor-space/components/CreatorFilterForm/CreatorFilterForm';
import {
	type FilterMenuFilterOption,
	FilterMenuType,
} from '@visitor-space/components/FilterMenu/FilterMenu.types';
import MaintainerFilterForm from '@visitor-space/components/MaintainerFilterForm/MaintainerFilterForm';
import { MediumFilterForm } from '@visitor-space/components/MediumFilterForm';
import { NewspaperSeriesNameFilterForm } from '@visitor-space/components/NewspaperSeriesNameFilterForm/NewspaperSeriesNameFilterForm';
import { ReleaseDateFilterForm } from '@visitor-space/components/ReleaseDateFilterForm';
import { SearchFilterId } from '@visitor-space/types';

const ALL_TABS: SearchPageMediaType[] = [
	SearchPageMediaType.All,
	SearchPageMediaType.Video,
	SearchPageMediaType.Audio,
	SearchPageMediaType.Newspaper,
];

/**
 * Filters for the search page
 * @param isGlobalArchive is the user currently looking in the global archive or in one specific archive of one maintainer
 * @param isKioskUser
 * @param isKeyUser
 * @param activeTab
 * @constructor
 */
export const SEARCH_PAGE_FILTERS = (
	isGlobalArchive: boolean,
	isKioskUser: boolean,
	isKeyUser: boolean,
	activeTab: SearchPageMediaType
): FilterMenuFilterOption[] => [
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
		tabs: ALL_TABS,
		isDisabled: () => {
			return !isGlobalArchive || !isKeyUser;
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
		tabs: ALL_TABS,
		isDisabled: () => {
			return !isGlobalArchive || isKioskUser;
		},
	},
	{
		id: SearchFilterId.ConsultablePublicDomain,
		label: tText('modules/visitor-space/const/visitor-space-filters___publiek-domain'),
		form: ConsultablePublicDomainFilterForm,
		type: FilterMenuType.Checkbox,
		tabs: [SearchPageMediaType.Newspaper],
		isDisabled: () => {
			return false;
		},
	},
	{
		id: SearchFilterId.Maintainers,
		label: tText('modules/visitor-space/const/index___aanbieder'),
		form: MaintainerFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
		isDisabled: () => {
			return !isGlobalArchive || isKioskUser;
		},
	},
	{
		id: SearchFilterId.NewspaperSeriesName,
		label: tText('Krant reeks'),
		form: NewspaperSeriesNameFilterForm,
		type: FilterMenuType.Modal,
		tabs: [SearchPageMediaType.Newspaper],
	},
	{
		id: SearchFilterId.ReleaseDate,
		label: tText('modules/visitor-space/const/visitor-space-filters___uitgavedatum'),
		form: ReleaseDateFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
	},
	// TODO Location of publication (newspaper only)
	{
		id: SearchFilterId.Medium,
		label: tText('modules/visitor-space/const/index___analoge-drager'),
		form: MediumFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
	},
	{
		id: SearchFilterId.Creator,
		label: tText('modules/visitor-space/const/index___maker'),
		form: CreatorFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
	},
	// TODO list of names of fallen soldiers (newspaper only)
	{
		id: SearchFilterId.Advanced,
		icon: IconNamesLight.DotsHorizontal,
		label: tText('modules/visitor-space/const/index___geavanceerd'),
		form: AdvancedFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
	},
];
