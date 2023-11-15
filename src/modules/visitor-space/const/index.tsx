// TODO move these files to a search page module
// metadata => advanced filters
// visitor space search page => search page
import { OrderDirection, TabProps } from '@meemoo/react-components';
import {
	ArrayParam,
	BooleanParam,
	NumberParam,
	QueryParamConfig,
	StringParam,
} from 'use-query-params';

import { Icon, IconNamesLight } from '@shared/components';
import { VIEW_TOGGLE_OPTIONS } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { VisitorSpaceMediaType } from '@shared/types';
import {
	AdvancedFilterForm,
	ConsultableMediaFilterForm,
	ConsultableOnlyOnLocationFilterForm,
	CreatedFilterForm,
	CreatorFilterForm,
	DurationFilterForm,
	FilterMenuFilterOption,
	FilterMenuSortOption,
	FilterMenuType,
	GenreFilterForm,
	KeywordsFilterForm,
	LanguageFilterForm,
	MaintainerFilterForm,
	MediumFilterForm,
	PublishedFilterForm,
} from '@visitor-space/components';

import { VisitorSpaceFilterId, VisitorSpaceSort, VisitorSpaceStatus } from '../types';

import { AdvancedFilterArrayParam } from './query-params';

export * from './metadata';
export * from './label-keys';

export const PUBLIC_COLLECTION = ''; // No maintainer query param means the public collection should be selected

export const DEFAULT_VISITOR_SPACE_COLOR = '#00c8aa';

export const VISITOR_SPACE_ITEM_COUNT = 24;

export const VISITOR_SPACE_QUERY_PARAM_INIT: Record<
	VisitorSpaceFilterId | QUERY_PARAM_KEY.SEARCH_QUERY_KEY,
	string | undefined
> & { page: number; orderProp: VisitorSpaceSort; orderDirection: OrderDirection } = {
	// Filters
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: undefined,
	[VisitorSpaceFilterId.Format]: VisitorSpaceMediaType.All,
	[VisitorSpaceFilterId.Maintainer]: undefined,
	[VisitorSpaceFilterId.Maintainers]: undefined,
	[VisitorSpaceFilterId.Medium]: undefined,
	[VisitorSpaceFilterId.Duration]: undefined,
	[VisitorSpaceFilterId.Created]: undefined,
	[VisitorSpaceFilterId.Published]: undefined,
	[VisitorSpaceFilterId.Creator]: undefined,
	[VisitorSpaceFilterId.Genre]: undefined,
	[VisitorSpaceFilterId.Keywords]: undefined,
	[VisitorSpaceFilterId.Language]: undefined,
	[VisitorSpaceFilterId.Advanced]: undefined,
	[VisitorSpaceFilterId.ConsultableOnlyOnLocation]: undefined,
	[VisitorSpaceFilterId.ConsultableMedia]: undefined,
	[VisitorSpaceFilterId.Cast]: undefined,
	[VisitorSpaceFilterId.Identifier]: undefined,
	[VisitorSpaceFilterId.ObjectType]: undefined,
	[VisitorSpaceFilterId.SpacialCoverage]: undefined,
	[VisitorSpaceFilterId.TemporalCoverage]: undefined,

	// Pagination
	page: 1,
	// Sorting
	orderProp: VisitorSpaceSort.Relevance,
	orderDirection: OrderDirection.desc,
};

export const VISITOR_SPACE_QUERY_PARAM_CONFIG: Record<string, QueryParamConfig<any>> = {
	// Filters
	format: StringParam,
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: ArrayParam,
	[VisitorSpaceFilterId.Maintainer]: StringParam,
	[VisitorSpaceFilterId.Medium]: ArrayParam,
	[VisitorSpaceFilterId.Duration]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.Created]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.Published]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.Creator]: StringParam,
	[VisitorSpaceFilterId.Genre]: ArrayParam,
	[VisitorSpaceFilterId.Keywords]: ArrayParam,
	[VisitorSpaceFilterId.Language]: ArrayParam,
	[VisitorSpaceFilterId.Maintainers]: ArrayParam,
	[VisitorSpaceFilterId.Advanced]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.ConsultableOnlyOnLocation]: BooleanParam,
	[VisitorSpaceFilterId.ConsultableMedia]: BooleanParam,
	// Pagination
	page: NumberParam,
	// Sorting
	orderProp: StringParam,
	orderDirection: StringParam,
	// UI
	filter: StringParam,
};

export const VISITOR_SPACE_TABS = (): TabProps[] => [
	{
		id: VisitorSpaceMediaType.All,
		label: tText('modules/visitor-space/const/index___alles'),
	},
	{
		id: VisitorSpaceMediaType.Video,
		icon: <Icon name={IconNamesLight.Video} aria-hidden />,
		label: tText('modules/visitor-space/const/index___videos'),
	},
	{
		id: VisitorSpaceMediaType.Audio,
		icon: <Icon name={IconNamesLight.Audio} aria-hidden />,
		label: tText('modules/visitor-space/const/index___audio'),
	},
];

export const VISITOR_SPACE_VIEW_TOGGLE_OPTIONS = VIEW_TOGGLE_OPTIONS;

// TODO rename this to SEARCH_FILTERS since these are not specific to a visitor space anymore in fase2
export const VISITOR_SPACE_FILTERS = (
	isPublicCollection: boolean,
	isKioskUser: boolean,
	isKeyUser: boolean
): FilterMenuFilterOption[] => [
	{
		id: VisitorSpaceFilterId.ConsultableMedia,
		label: tText('modules/visitor-space/const/index___alles-wat-raadpleegbaar-is'),
		form: ConsultableMediaFilterForm,
		type: FilterMenuType.Checkbox,
		isDisabled: () => {
			return !isPublicCollection || !isKeyUser;
		},
	},
	{
		id: VisitorSpaceFilterId.ConsultableOnlyOnLocation,
		label: tText('modules/visitor-space/const/index___enkel-ter-plaatse-beschikbaar'),
		form: ConsultableOnlyOnLocationFilterForm,
		type: FilterMenuType.Checkbox,
		isDisabled: () => {
			return !isPublicCollection || isKioskUser;
		},
	},
	{
		id: VisitorSpaceFilterId.Medium,
		label: tText('modules/visitor-space/const/index___analoge-drager'),
		form: MediumFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: VisitorSpaceFilterId.Duration,
		label: tText('modules/visitor-space/const/index___duurtijd'),
		form: DurationFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: VisitorSpaceFilterId.Created,
		label: tText('modules/visitor-space/const/index___creatiedatum'),
		form: CreatedFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: VisitorSpaceFilterId.Published,
		label: tText('modules/visitor-space/const/index___publicatiedatum'),
		form: PublishedFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: VisitorSpaceFilterId.Creator,
		label: tText('modules/visitor-space/const/index___maker'),
		form: CreatorFilterForm,
		type: FilterMenuType.Modal,
	},
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	{
		id: VisitorSpaceFilterId.Genre,
		label: tText('modules/visitor-space/const/index___genre'),
		form: GenreFilterForm,
		type: FilterMenuType.Modal,
		isDisabled: () => true,
	},
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	{
		id: VisitorSpaceFilterId.Keywords,
		label: tText('modules/visitor-space/const/index___trefwoorden'),
		form: KeywordsFilterForm,
		type: FilterMenuType.Modal,
		isDisabled: () => true,
	},
	{
		id: VisitorSpaceFilterId.Language,
		label: tText('modules/visitor-space/const/index___taal'),
		form: LanguageFilterForm,
		type: FilterMenuType.Modal,
	},
	{
		id: VisitorSpaceFilterId.Maintainers,
		label: tText('modules/visitor-space/const/index___aanbieder'),
		form: MaintainerFilterForm,
		type: FilterMenuType.Modal,
		isDisabled: () => {
			return !isPublicCollection || isKioskUser;
		},
	},
	{
		id: VisitorSpaceFilterId.Advanced,
		icon: IconNamesLight.DotsHorizontal,
		label: tText('modules/visitor-space/const/index___geavanceerd'),
		form: AdvancedFilterForm,
		type: FilterMenuType.Modal,
	},
];

export const VISITOR_SPACE_ACTIVE_SORT_MAP = (): { [key in VisitorSpaceSort]: string } => ({
	[VisitorSpaceSort.Date]: tText('modules/visitor-space/const/index___sorteer-op-datum'),
	[VisitorSpaceSort.Relevance]: tText(
		'modules/visitor-space/const/index___sorteer-op-relevantie'
	),
	[VisitorSpaceSort.Title]: tText('modules/visitor-space/const/index___sorteer-op-titel'),
	[VisitorSpaceSort.Archived]: tText(
		'modules/visitor-space/const/index___sorteer-op-gearchiveerd'
	),
});

export const VISITOR_SPACE_SORT_OPTIONS = (): FilterMenuSortOption[] => [
	{
		label: tText('modules/visitor-space/const/index___relevantie'),
		orderProp: VisitorSpaceSort.Relevance,
	},
	{
		label: tText('modules/visitor-space/const/index___datum-oplopend'),
		orderProp: VisitorSpaceSort.Date,
		orderDirection: OrderDirection.asc,
	},
	{
		label: tText('modules/visitor-space/const/index___datum-aflopend'),
		orderProp: VisitorSpaceSort.Date,
		orderDirection: OrderDirection.desc,
	},
	{
		label: tText('modules/visitor-space/const/index___gearchiveerd'),
		orderProp: VisitorSpaceSort.Archived,
		orderDirection: OrderDirection.desc,
	},
	// schema_name niet sorteerbaar in https://meemoo.atlassian.net/wiki/pages/viewpage.action?pageId=3309174878&pageVersion=3
	// {
	// 	label: tText('modules/visitor-space/const/index___van-a-tot-z'),
	// 	orderProp: VisitorSpaceSort.Title,
	// 	orderDirection: OrderDirection.asc,
	// },
	// {
	// 	label: tText('modules/visitor-space/const/index___van-z-tot-a'),
	// 	orderProp: VisitorSpaceSort.Title,
	// 	orderDirection: OrderDirection.desc,
	// },
];

export const VisitorSpaceStatusOptions = (): TabProps[] => {
	return [
		{
			id: 'ALL',
			label: tText('modules/visitor-space/const/index___alles'),
		},
		{
			id: VisitorSpaceStatus.Requested,
			label: tText('modules/visitor-space/const/index___in-aanvraag'),
		},
		{
			id: VisitorSpaceStatus.Active,
			label: tText('modules/visitor-space/const/index___gepubliceerd'),
		},
		{
			id: VisitorSpaceStatus.Inactive,
			label: tText('modules/visitor-space/const/index___gedepubliceerd'),
		},
	];
};
