// TODO move these files to a search page module
// metadata => advanced filters
// visitor space search page => search page
import { OrderDirection, type TabProps } from '@meemoo/react-components';
import {
	ArrayParam,
	BooleanParam,
	type DecodedValueMap,
	NumberParam,
	type QueryParamConfig,
	StringParam,
} from 'use-query-params';

import { VIEW_TOGGLE_OPTIONS } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { SearchPageMediaType } from '@shared/types/ie-objects';
import { type FilterMenuSortOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';

import { SearchFilterId, SearchSortProp, VisitorSpaceStatus } from '../types';

import { AdvancedFilterArrayParam } from './query-params';

export const GLOBAL_ARCHIVE = ''; // No maintainer query param means the public collection should be selected

export const DEFAULT_VISITOR_SPACE_COLOR = '#00c8aa';

export const SEARCH_RESULTS_PAGE_SIZE = 24;

export const VISITOR_SPACE_QUERY_PARAM_INIT: Record<
	SearchFilterId | QUERY_PARAM_KEY.SEARCH_QUERY_KEY,
	string | undefined
> & { page: number; orderProp: SearchSortProp; orderDirection: OrderDirection } = {
	// Filters
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: undefined,
	[SearchFilterId.Format]: SearchPageMediaType.All,
	[SearchFilterId.Maintainer]: undefined,
	[SearchFilterId.Maintainers]: undefined,
	[SearchFilterId.Medium]: undefined,
	[SearchFilterId.Duration]: undefined,
	[SearchFilterId.ReleaseDate]: undefined,
	[SearchFilterId.Created]: undefined,
	[SearchFilterId.Published]: undefined,
	[SearchFilterId.Creator]: undefined,
	[SearchFilterId.NewspaperSeriesName]: undefined,
	[SearchFilterId.LocationCreated]: undefined,
	[SearchFilterId.Genre]: undefined,
	[SearchFilterId.Keywords]: undefined,
	[SearchFilterId.Language]: undefined,
	[SearchFilterId.ConsultableOnlyOnLocation]: undefined,
	[SearchFilterId.ConsultableMedia]: undefined,
	[SearchFilterId.ConsultablePublicDomain]: undefined,
	[SearchFilterId.Cast]: undefined,
	[SearchFilterId.Identifier]: undefined,
	[SearchFilterId.ObjectType]: undefined,
	[SearchFilterId.SpacialCoverage]: undefined,
	[SearchFilterId.TemporalCoverage]: undefined,
	[SearchFilterId.Advanced]: undefined,

	// Pagination
	page: 1,
	// Sorting
	orderProp: SearchSortProp.Relevance,
	orderDirection: OrderDirection.desc,
};

export const SEARCH_PAGE_QUERY_PARAM_CONFIG: Record<string, QueryParamConfig<any>> = {
	// Filters
	format: StringParam,
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: ArrayParam,
	[SearchFilterId.Maintainer]: StringParam,
	[SearchFilterId.Medium]: ArrayParam,
	[SearchFilterId.Duration]: AdvancedFilterArrayParam,
	[SearchFilterId.Created]: AdvancedFilterArrayParam,
	[SearchFilterId.Published]: AdvancedFilterArrayParam,
	[SearchFilterId.ReleaseDate]: AdvancedFilterArrayParam,
	[SearchFilterId.Creator]: StringParam,
	[SearchFilterId.NewspaperSeriesName]: StringParam,
	[SearchFilterId.LocationCreated]: StringParam,
	[SearchFilterId.Genre]: ArrayParam,
	[SearchFilterId.Keywords]: ArrayParam,
	[SearchFilterId.Language]: ArrayParam,
	[SearchFilterId.Maintainers]: ArrayParam,
	[SearchFilterId.Advanced]: AdvancedFilterArrayParam,
	[SearchFilterId.ConsultableOnlyOnLocation]: BooleanParam,
	[SearchFilterId.ConsultableMedia]: BooleanParam,
	[SearchFilterId.ConsultablePublicDomain]: BooleanParam,
	// Pagination
	page: NumberParam,
	// Sorting
	orderProp: StringParam,
	orderDirection: StringParam,
	// UI
	filter: StringParam,
};

export type SearchPageQueryParams = Partial<DecodedValueMap<typeof SEARCH_PAGE_QUERY_PARAM_CONFIG>>;

export const VISITOR_SPACE_VIEW_TOGGLE_OPTIONS = VIEW_TOGGLE_OPTIONS;

export const VISITOR_SPACE_ACTIVE_SORT_MAP = (): { [key in SearchSortProp]: string } => ({
	[SearchSortProp.Date]: tText('modules/visitor-space/const/index___sorteer-op-datum'),
	[SearchSortProp.Relevance]: tText('modules/visitor-space/const/index___sorteer-op-relevantie'),
	[SearchSortProp.Title]: tText('modules/visitor-space/const/index___sorteer-op-titel'),
	[SearchSortProp.Archived]: tText('modules/visitor-space/const/index___sorteer-op-gearchiveerd'),
});

export const VISITOR_SPACE_SORT_OPTIONS = (): FilterMenuSortOption[] => [
	{
		label: tText('modules/visitor-space/const/index___relevantie'),
		orderProp: SearchSortProp.Relevance,
	},
	{
		label: tText('modules/visitor-space/const/index___datum-oplopend'),
		orderProp: SearchSortProp.Date,
		orderDirection: OrderDirection.asc,
	},
	{
		label: tText('modules/visitor-space/const/index___datum-aflopend'),
		orderProp: SearchSortProp.Date,
		orderDirection: OrderDirection.desc,
	},
	{
		label: tText('modules/visitor-space/const/index___gearchiveerd'),
		orderProp: SearchSortProp.Archived,
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
