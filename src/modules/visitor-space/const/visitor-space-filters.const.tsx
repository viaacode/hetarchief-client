// TODO rename this to SEARCH_FILTERS since these are not specific to a visitor space anymore in fase2
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { SearchPageMediaType } from '@shared/types/ie-objects';
import { AdvancedFilterForm } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm';
import { ConsultableMediaFilterForm } from '@visitor-space/components/ConsultableMediaFilterForm/ConsultableMediaFilterForm';
import { ConsultableOnlyOnLocationFilterForm } from '@visitor-space/components/ConsultableOnlyOnLocationFilterForm/ConsultableOnlyOnLocationFilterForm';
import { ConsultablePublicDomainFilterForm } from '@visitor-space/components/ConsultablePublicDomainFilterForm/ConsultablePublicDomainFilterForm';
import { CreatedFilterForm } from '@visitor-space/components/CreatedFilterForm';
import { CreatorFilterForm } from '@visitor-space/components/CreatorFilterForm';
import { DurationFilterForm } from '@visitor-space/components/DurationFilterForm';
import {
	type FilterMenuFilterOption,
	FilterMenuType,
} from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { GenreFilterForm } from '@visitor-space/components/GenreFilterForm';
import KeywordsFilterForm from '@visitor-space/components/KeywordsFilterForm/KeywordsFilterForm';
import LanguageFilterForm from '@visitor-space/components/LanguageFilterForm/LanguageFilterForm';
import MaintainerFilterForm from '@visitor-space/components/MaintainerFilterForm/MaintainerFilterForm';
import { MediumFilterForm } from '@visitor-space/components/MediumFilterForm';
import { PublishedFilterForm } from '@visitor-space/components/PublishedFilterForm';
import { SearchFilterId } from '@visitor-space/types';

const ALL_TABS: SearchPageMediaType[] = [
	SearchPageMediaType.All,
	SearchPageMediaType.Video,
	SearchPageMediaType.Audio,
	SearchPageMediaType.Newspaper,
];

export const SEARCH_PAGE_FILTERS = (
	isPublicCollection: boolean,
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
			return !isPublicCollection || !isKeyUser;
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
			return !isPublicCollection || isKioskUser;
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
		id: SearchFilterId.Medium,
		label: tText('modules/visitor-space/const/index___analoge-drager'),
		form: MediumFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
	},
	{
		id: SearchFilterId.Duration,
		label: tText('modules/visitor-space/const/index___duurtijd'),
		form: DurationFilterForm,
		type: FilterMenuType.Modal,
		tabs: [SearchPageMediaType.All, SearchPageMediaType.Video, SearchPageMediaType.Audio],
	},
	{
		id: SearchFilterId.Created,
		label: tText('modules/visitor-space/const/index___creatiedatum'),
		form: CreatedFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
	},
	{
		id: SearchFilterId.Published,
		label: tText('modules/visitor-space/const/index___publicatiedatum'),
		form: PublishedFilterForm,
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
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	{
		id: SearchFilterId.Genre,
		label: tText('modules/visitor-space/const/index___genre'),
		form: GenreFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
		isDisabled: () => true,
	},
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	{
		id: SearchFilterId.Keywords,
		label: tText('modules/visitor-space/const/index___trefwoorden'),
		form: KeywordsFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
		isDisabled: () => true,
	},
	{
		id: SearchFilterId.Language,
		label: tText('modules/visitor-space/const/index___taal'),
		form: LanguageFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
	},
	{
		id: SearchFilterId.Maintainers,
		label: tText('modules/visitor-space/const/index___aanbieder'),
		form: MaintainerFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
		isDisabled: () => {
			return !isPublicCollection || isKioskUser;
		},
	},
	{
		id: SearchFilterId.Advanced,
		icon: IconNamesLight.DotsHorizontal,
		label: tText('modules/visitor-space/const/index___geavanceerd'),
		form: AdvancedFilterForm,
		type: FilterMenuType.Modal,
		tabs: ALL_TABS,
	},
];
