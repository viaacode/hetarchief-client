import { OrderDirection, TabProps } from '@meemoo/react-components';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

import { Icon, IconNamesLight } from '@shared/components';
import { SEARCH_QUERY_KEY, VIEW_TOGGLE_OPTIONS } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { VisitorSpaceMediaType } from '@shared/types';

import {
	AdvancedFilterForm,
	CreatedFilterForm,
	CreatorFilterForm,
	DurationFilterForm,
	FilterMenuFilterOption,
	FilterMenuSortOption,
	GenreFilterForm,
	KeywordsFilterForm,
	LanguageFilterForm,
	MaintainerFilterForm,
	MediumFilterForm,
	PublishedFilterForm,
} from '../components';
import { VisitorSpaceFilterId, VisitorSpaceSort, VisitorSpaceStatus } from '../types';

import { AdvancedFilterArrayParam } from './query-params';

export * from './metadata';
export * from './label-keys';

export const PUBLIC_COLLECTION = ''; // No maintainer query param means the public collection should be selected

export const DEFAULT_VISITOR_SPACE_COLOR = '#00c8aa';

export const VISITOR_SPACE_ITEM_COUNT = 39;

export const VISITOR_SPACE_QUERY_PARAM_INIT = {
	// Filters
	format: VisitorSpaceMediaType.All,
	[SEARCH_QUERY_KEY]: undefined,
	[VisitorSpaceFilterId.Maintainer]: '',
	[VisitorSpaceFilterId.Medium]: undefined,
	[VisitorSpaceFilterId.Duration]: undefined,
	[VisitorSpaceFilterId.Created]: undefined,
	[VisitorSpaceFilterId.Published]: undefined,
	[VisitorSpaceFilterId.Creator]: undefined,
	[VisitorSpaceFilterId.Genre]: undefined,
	[VisitorSpaceFilterId.Keywords]: undefined,
	[VisitorSpaceFilterId.Language]: undefined,
	[VisitorSpaceFilterId.Advanced]: undefined,
	// Pagination
	page: 1,
	// Sorting
	orderProp: VisitorSpaceSort.Relevance,
	orderDirection: OrderDirection.desc,
};

export const VISITOR_SPACE_QUERY_PARAM_CONFIG = {
	// Filters
	format: withDefault(StringParam, VISITOR_SPACE_QUERY_PARAM_INIT.format),
	[SEARCH_QUERY_KEY]: ArrayParam,
	[VisitorSpaceFilterId.Maintainer]: withDefault(StringParam, ''),
	[VisitorSpaceFilterId.Medium]: ArrayParam,
	[VisitorSpaceFilterId.Duration]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.Created]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.Published]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.Creator]: ArrayParam,
	[VisitorSpaceFilterId.Genre]: ArrayParam,
	[VisitorSpaceFilterId.Keywords]: ArrayParam,
	[VisitorSpaceFilterId.Language]: ArrayParam,
	[VisitorSpaceFilterId.Maintainers]: ArrayParam,
	[VisitorSpaceFilterId.Advanced]: AdvancedFilterArrayParam,
	// Pagination
	page: withDefault(NumberParam, VISITOR_SPACE_QUERY_PARAM_INIT.page),
	// Sorting
	orderProp: withDefault(StringParam, VISITOR_SPACE_QUERY_PARAM_INIT.orderProp),
	orderDirection: withDefault(StringParam, VISITOR_SPACE_QUERY_PARAM_INIT.orderDirection),
	// UI
	filter: StringParam,
	focus: StringParam,
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

export const VISITOR_SPACE_FILTERS = (activeVisitorSpace: string): FilterMenuFilterOption[] => [
	{
		id: VisitorSpaceFilterId.Medium,
		label: tText('modules/visitor-space/const/index___analoge-drager'),
		form: MediumFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Duration,
		label: tText('modules/visitor-space/const/index___duurtijd'),
		form: DurationFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Created,
		label: tText('modules/visitor-space/const/index___creatiedatum'),
		form: CreatedFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Published,
		label: tText('modules/visitor-space/const/index___publicatiedatum'),
		form: PublishedFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Creator,
		label: tText('modules/visitor-space/const/index___maker'),
		form: CreatorFilterForm,
	},
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	{
		id: VisitorSpaceFilterId.Genre,
		label: tText('modules/visitor-space/const/index___genre'),
		form: GenreFilterForm,
		isDisabled: () => true,
	},
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	{
		id: VisitorSpaceFilterId.Keywords,
		label: tText('modules/visitor-space/const/index___trefwoorden'),
		form: KeywordsFilterForm,
		isDisabled: () => true,
	},
	{
		id: VisitorSpaceFilterId.Language,
		label: tText('modules/visitor-space/const/index___taal'),
		form: LanguageFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Maintainers,
		icon: IconNamesLight.DotsHorizontal,
		label: tText('modules/visitor-space/const/index___aanbieder'),
		form: MaintainerFilterForm,
		isDisabled: () => activeVisitorSpace !== PUBLIC_COLLECTION,
	},
	{
		id: VisitorSpaceFilterId.Advanced,
		icon: IconNamesLight.DotsHorizontal,
		label: tText('modules/visitor-space/const/index___geavanceerd'),
		form: AdvancedFilterForm,
	},
];

export const VISITOR_SPACE_ACTIVE_SORT_MAP = (): { [key in VisitorSpaceSort]: string } => ({
	[VisitorSpaceSort.Date]: tText('modules/visitor-space/const/index___sorteer-op-datum'),
	[VisitorSpaceSort.Relevance]: tText(
		'modules/visitor-space/const/index___sorteer-op-relevantie'
	),
	[VisitorSpaceSort.Title]: tText('modules/visitor-space/const/index___sorteer-op-titel'),
	[VisitorSpaceSort.Published]: tText(
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
		orderProp: VisitorSpaceSort.Published,
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
