import { TabProps } from '@meemoo/react-components';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

import { Icon } from '@shared/components';
import { SEARCH_QUERY_KEY, VIEW_TOGGLE_OPTIONS } from '@shared/const';
import { i18n } from '@shared/helpers/i18n';
import { OrderDirection, VisitorSpaceMediaType } from '@shared/types';

import {
	AdvancedFilterForm,
	CreatedFilterForm,
	CreatorFilterForm,
	DurationFilterForm,
	FilterMenuFilterOption,
	FilterMenuSortOption,
	LanguageFilterForm,
	MediumFilterForm,
	PublishedFilterForm,
} from '../components';
import { VisitorSpaceFilterId, VisitorSpaceSort, VisitorSpaceStatus } from '../types';

import { AdvancedFilterArrayParam } from './query-params';

export * from './metadata';
export * from './label-keys';

export const DEFAULT_VISITOR_SPACE_COLOR = '#00c8aa';

export const VISITOR_SPACE_ITEM_COUNT = 39;

export const VISITOR_SPACE_QUERY_PARAM_INIT = {
	// Filters
	format: VisitorSpaceMediaType.All,
	[SEARCH_QUERY_KEY]: undefined,
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
	[VisitorSpaceFilterId.Medium]: ArrayParam,
	[VisitorSpaceFilterId.Duration]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.Created]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.Published]: AdvancedFilterArrayParam,
	[VisitorSpaceFilterId.Creator]: ArrayParam,
	[VisitorSpaceFilterId.Genre]: ArrayParam,
	[VisitorSpaceFilterId.Keywords]: ArrayParam,
	[VisitorSpaceFilterId.Language]: ArrayParam,
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
		label: i18n.t('modules/visitor-space/const/index___alles'),
	},
	{
		id: VisitorSpaceMediaType.Video,
		icon: <Icon name="video" aria-hidden />,
		label: i18n.t('modules/visitor-space/const/index___videos'),
	},
	{
		id: VisitorSpaceMediaType.Audio,
		icon: <Icon name="audio" aria-hidden />,
		label: i18n.t('modules/visitor-space/const/index___audio'),
	},
];

export const VISITOR_SPACE_VIEW_TOGGLE_OPTIONS = VIEW_TOGGLE_OPTIONS;

export const VISITOR_SPACE_FILTERS = (): FilterMenuFilterOption[] => [
	{
		id: VisitorSpaceFilterId.Medium,
		label: i18n.t('modules/visitor-space/const/index___analoge-drager'),
		form: MediumFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Duration,
		label: i18n.t('modules/visitor-space/const/index___duurtijd'),
		form: DurationFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Created,
		label: i18n.t('modules/visitor-space/const/index___creatiedatum'),
		form: CreatedFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Published,
		label: i18n.t('modules/visitor-space/const/index___publicatiedatum'),
		form: PublishedFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Creator,
		label: i18n.t('modules/visitor-space/const/index___maker'),
		form: CreatorFilterForm,
	},
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	// {
	// 	id: VisitorSpaceFilterId.Genre,
	// 	label: TranslationService.getTranslation('modules/visitor-space/const/index___genre'),
	// 	form: GenreFilterForm,
	// },
	// Disabled for https://meemoo.atlassian.net/browse/ARC-246
	// {
	// 	id: VisitorSpaceFilterId.Keywords,
	// 	label: TranslationService.getTranslation('modules/visitor-space/const/index___trefwoorden'),
	// 	form: KeywordsFilterForm,
	// },
	{
		id: VisitorSpaceFilterId.Language,
		label: i18n.t('modules/visitor-space/const/index___taal'),
		form: LanguageFilterForm,
	},
	{
		id: VisitorSpaceFilterId.Advanced,
		icon: 'dots-horizontal',
		label: i18n.t('modules/visitor-space/const/index___geavanceerd'),
		form: AdvancedFilterForm,
	},
];

export const VISITOR_SPACE_ACTIVE_SORT_MAP = (): { [key in VisitorSpaceSort]: string } => ({
	[VisitorSpaceSort.Date]: i18n.t('modules/visitor-space/const/index___sorteer-op-datum'),
	[VisitorSpaceSort.Relevance]: i18n.t(
		'modules/visitor-space/const/index___sorteer-op-relevantie'
	),
	[VisitorSpaceSort.Title]: i18n.t('modules/visitor-space/const/index___sorteer-op-titel'),
});

export const VISITOR_SPACE_SORT_OPTIONS = (): FilterMenuSortOption[] => [
	{
		label: i18n.t('modules/visitor-space/const/index___relevantie'),
		orderProp: VisitorSpaceSort.Relevance,
	},
	{
		label: i18n.t('modules/visitor-space/const/index___datum-oplopend'),
		orderProp: VisitorSpaceSort.Date,
		orderDirection: OrderDirection.asc,
	},
	{
		label: i18n.t('modules/visitor-space/const/index___datum-aflopend'),
		orderProp: VisitorSpaceSort.Date,
		orderDirection: OrderDirection.desc,
	},
	// schema_name niet sorteerbaar in https://meemoo.atlassian.net/wiki/pages/viewpage.action?pageId=3309174878&pageVersion=3
	// {
	// 	label: TranslationService.getTranslation('modules/visitor-space/const/index___van-a-tot-z'),
	// 	orderProp: VisitorSpaceSort.Title,
	// 	orderDirection: OrderDirection.asc,
	// },
	// {
	// 	label: TranslationService.getTranslation('modules/visitor-space/const/index___van-z-tot-a'),
	// 	orderProp: VisitorSpaceSort.Title,
	// 	orderDirection: OrderDirection.desc,
	// },
];

export const VisitorSpaceStatusOptions = (): TabProps[] => {
	return [
		{
			id: 'ALL',
			label: i18n.t('modules/visitor-space/const/index___alles'),
		},
		{
			id: VisitorSpaceStatus.Requested,
			label: i18n.t('modules/visitor-space/const/index___in-aanvraag'),
		},
		{
			id: VisitorSpaceStatus.Active,
			label: i18n.t('modules/visitor-space/const/index___gepubliceerd'),
		},
		{
			id: VisitorSpaceStatus.Inactive,
			label: i18n.t('modules/visitor-space/const/index___gedepubliceerd'),
		},
	];
};
