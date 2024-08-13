// TODO rename this to SEARCH_FILTERS since these are not specific to a visitor space anymore in fase2
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { AdvancedFilterForm } from '@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm';
import { ConsultableMediaFilterForm } from '@visitor-space/components/ConsultableMediaFilterForm';
import { ConsultableOnlyOnLocationFilterForm } from '@visitor-space/components/ConsultableOnlyOnLocationFilterForm';
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

export const VISITOR_SPACE_FILTERS = (
	isPublicCollection: boolean,
	isKioskUser: boolean,
	isKeyUser: boolean
): FilterMenuFilterOption[] => [
	{
		id: SearchFilterId.ConsultableMedia,
		label: tText('modules/visitor-space/const/index___alles-wat-raadpleegbaar-is'),
		form: ConsultableMediaFilterForm,
		type: FilterMenuType.Checkbox,
		isDisabled: () => {
			return !isPublicCollection || !isKeyUser;
		},
	},
	{
		id: SearchFilterId.ConsultableOnlyOnLocation,
		label: tText('modules/visitor-space/const/index___enkel-ter-plaatse-beschikbaar'),
		form: ConsultableOnlyOnLocationFilterForm,
		type: FilterMenuType.Checkbox,
		isDisabled: () => {
			return !isPublicCollection || isKioskUser;
		},
	},
	{
		id: SearchFilterId.Medium,
		label: tText('modules/visitor-space/const/index___analoge-drager'),
		form: MediumFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: SearchFilterId.Duration,
		label: tText('modules/visitor-space/const/index___duurtijd'),
		form: DurationFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: SearchFilterId.Created,
		label: tText('modules/visitor-space/const/index___creatiedatum'),
		form: CreatedFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: SearchFilterId.Published,
		label: tText('modules/visitor-space/const/index___publicatiedatum'),
		form: PublishedFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: SearchFilterId.Creator,
		label: tText('modules/visitor-space/const/index___maker'),
		form: CreatorFilterForm,
		type: FilterMenuType.Modal,
	},
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	{
		id: SearchFilterId.Genre,
		label: tText('modules/visitor-space/const/index___genre'),
		form: GenreFilterForm,
		type: FilterMenuType.Modal,
		isDisabled: () => true,
	},
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	{
		id: SearchFilterId.Keywords,
		label: tText('modules/visitor-space/const/index___trefwoorden'),
		form: KeywordsFilterForm,
		type: FilterMenuType.Modal,
		isDisabled: () => true,
	},
	{
		id: SearchFilterId.Language,
		label: tText('modules/visitor-space/const/index___taal'),
		form: LanguageFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: SearchFilterId.Maintainers,
		label: tText('modules/visitor-space/const/index___aanbieder'),
		form: MaintainerFilterForm,
		type: FilterMenuType.Modal,
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
	},
];
