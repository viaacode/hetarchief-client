// TODO move these files to a search page module
// advanced-filters => advanced filters
// visitor space search page => search page
import { OrderDirection, type TabProps } from '@meemoo/react-components';
import {
	type DecodedValueMap,
	NumberParam,
	type QueryParamConfig,
	StringParam,
} from 'use-query-params';

import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { IeObjectsSearchFilterField, SearchPageMediaType } from '@shared/types/ie-objects';
import type { FilterMenuSortOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';

import { SearchSortProp, VisitorSpaceStatus } from '../types';

import { AdvancedFilterArrayParam } from './advanced-filter-array-param';

export const GLOBAL_ARCHIVE = ''; // No maintainer query param means the public collection should be selected

export const DEFAULT_VISITOR_SPACE_COLOR = '#00c8aa';

export const SEARCH_RESULTS_PAGE_SIZE = 24;

export const VISITOR_SPACE_QUERY_PARAM_INIT: Record<
	| IeObjectsSearchFilterField
	| QUERY_PARAM_KEY.SEARCH_QUERY_KEY
	| 'page'
	| 'orderProp'
	| 'orderDirection',
	string | number | undefined
> = {
	// Filters
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: undefined,
	[IeObjectsSearchFilterField.QUERY]: undefined,
	[IeObjectsSearchFilterField.FORMAT]: SearchPageMediaType.All,
	[IeObjectsSearchFilterField.NAME]: undefined,
	[IeObjectsSearchFilterField.DESCRIPTION]: undefined,
	[IeObjectsSearchFilterField.MAINTAINER_SLUG]: undefined,
	[IeObjectsSearchFilterField.MAINTAINER_ID]: undefined,
	[IeObjectsSearchFilterField.MEDIUM]: undefined,
	[IeObjectsSearchFilterField.DURATION]: undefined,
	[IeObjectsSearchFilterField.RELEASE_DATE]: undefined,
	[IeObjectsSearchFilterField.CREATED]: undefined,
	[IeObjectsSearchFilterField.PUBLISHED]: undefined,
	[IeObjectsSearchFilterField.CREATOR]: undefined,
	[IeObjectsSearchFilterField.PUBLISHER]: undefined,
	[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME]: undefined,
	[IeObjectsSearchFilterField.LOCATION_CREATED]: undefined,
	[IeObjectsSearchFilterField.MENTIONS]: undefined,
	[IeObjectsSearchFilterField.GENRE]: undefined,
	[IeObjectsSearchFilterField.KEYWORD]: undefined,
	[IeObjectsSearchFilterField.LANGUAGE]: undefined,
	[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: undefined,
	[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: undefined,
	[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: undefined,
	[IeObjectsSearchFilterField.CAST]: undefined,
	[IeObjectsSearchFilterField.IDENTIFIER]: undefined,
	[IeObjectsSearchFilterField.OBJECT_TYPE]: undefined,
	[IeObjectsSearchFilterField.SPACIAL_COVERAGE]: undefined,
	[IeObjectsSearchFilterField.TEMPORAL_COVERAGE]: undefined,
	[IeObjectsSearchFilterField.ADVANCED]: undefined,
	[IeObjectsSearchFilterField.LICENSES]: undefined,

	// Pagination
	page: 1,
	// Sorting
	orderProp: SearchSortProp.Relevance,
	orderDirection: OrderDirection.desc,
} as const;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const SEARCH_PAGE_QUERY_PARAM_CONFIG: Record<string, QueryParamConfig<any>> = {
	// Filters
	format: StringParam,
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.QUERY]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.MAINTAINER_ID]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.MAINTAINER_SLUG]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.MEDIUM]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.DURATION]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.CREATED]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.PUBLISHED]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.RELEASE_DATE]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.CREATOR]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.LOCATION_CREATED]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.MENTIONS]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.GENRE]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.KEYWORD]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.LANGUAGE]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.ADVANCED]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: AdvancedFilterArrayParam,
	[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: AdvancedFilterArrayParam,
	// Pagination
	page: NumberParam,
	// Sorting
	orderProp: StringParam,
	orderDirection: StringParam,
	// UI
	filter: StringParam,
};

export type SearchPageQueryParams = Partial<DecodedValueMap<typeof SEARCH_PAGE_QUERY_PARAM_CONFIG>>;

export const VISITOR_SPACE_ACTIVE_SORT_MAP = (): {
	[key in SearchSortProp]: string;
} => ({
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
