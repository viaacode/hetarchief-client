import { compact, isString } from 'lodash-es';

import { IeObjectLicense } from '@ie-objects/ie-objects.types';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
} from '@shared/types/ie-objects';
import { type VisitRequest } from '@shared/types/visit-request';

import { type SearchPageQueryParams, VISITOR_SPACE_QUERY_PARAM_INIT } from '../../const';
import { FILTER_LABEL_VALUE_DELIMITER, SearchFilterId } from '../../types';
import { mapAdvancedToElastic } from '../map-filters';

export const VISITOR_SPACE_LICENSES = [
	IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
	IeObjectLicense.BEZOEKERTOOL_CONTENT,
];

export const mapMaintainerToElastic = (
	query: SearchPageQueryParams,
	activeVisitorSpace: VisitRequest | undefined
): IeObjectsSearchFilter[] => {
	const maintainerId =
		activeVisitorSpace?.spaceSlug === query?.[SearchFilterId.Maintainer]
			? activeVisitorSpace?.spaceMaintainerId
			: '';

	if (!maintainerId) {
		return [];
	}

	const filterByObjectIds =
		(activeVisitorSpace?.accessibleObjectIds?.length || 0) > 0
			? {
					field: IeObjectsSearchFilterField.IDENTIFIER,
					operator: IeObjectsSearchOperator.IS,
					multiValue: activeVisitorSpace?.accessibleObjectIds,
			  }
			: null;

	return compact([
		{
			field: IeObjectsSearchFilterField.MAINTAINER_ID,
			operator: IeObjectsSearchOperator.IS,
			value: maintainerId,
		},
		// If a visitor space is selected, we only want to show objects that have a visitor space license
		// https://meemoo.atlassian.net/browse/ARC-1655
		{
			field: IeObjectsSearchFilterField.LICENSES,
			operator: IeObjectsSearchOperator.IS,
			multiValue: VISITOR_SPACE_LICENSES,
		},
		// Filter by object ids if the user received folder access to the visitor space
		// https://meemoo.atlassian.net/browse/ARC-1655
		filterByObjectIds,
	]);
};

const getFiltersForSearchTerms = (query: SearchPageQueryParams): IeObjectsSearchFilter[] => {
	if (!query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]) {
		return [];
	}
	const searchTerms = isString(query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY])
		? [query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]]
		: query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY];
	return searchTerms.map((searchTerm: string) => {
		return {
			field: IeObjectsSearchFilterField.QUERY,
			operator: IeObjectsSearchOperator.CONTAINS,
			value: searchTerm || '',
		};
	});
};

export const mapFiltersToElastic = (query: SearchPageQueryParams): IeObjectsSearchFilter[] => {
	return [
		// Searchbar
		...getFiltersForSearchTerms(query),
		// Tabs
		{
			field: IeObjectsSearchFilterField.FORMAT,
			operator: IeObjectsSearchOperator.IS,
			value: query.format || VISITOR_SPACE_QUERY_PARAM_INIT.format,
		},
		// Medium
		{
			field: IeObjectsSearchFilterField.MEDIUM,
			operator: IeObjectsSearchOperator.IS,
			multiValue: compact(query[SearchFilterId.Medium] || []) as string[],
		},
		// Duration
		...(query[SearchFilterId.Duration] || []).flatMap(mapAdvancedToElastic),
		// Created
		...(query[SearchFilterId.Created] || []).flatMap(mapAdvancedToElastic),
		// Published
		...(query[SearchFilterId.Published] || []).flatMap(mapAdvancedToElastic),
		// Creator
		{
			field: IeObjectsSearchFilterField.CREATOR,
			operator: IeObjectsSearchOperator.CONTAINS,
			value: (query[SearchFilterId.Creator] as string) || '',
		},
		// Genre
		{
			field: IeObjectsSearchFilterField.GENRE,
			operator: IeObjectsSearchOperator.IS,
			multiValue: compact(query[SearchFilterId.Genre] || []) as string[],
		},
		// Keywords
		{
			field: IeObjectsSearchFilterField.KEYWORD,
			operator: IeObjectsSearchOperator.IS,
			multiValue: compact(query[SearchFilterId.Keywords] || []) as string[],
		},
		// Language
		{
			field: IeObjectsSearchFilterField.LANGUAGE,
			operator: IeObjectsSearchOperator.IS,
			multiValue: (compact(query[SearchFilterId.Language] || []) as string[]).map(
				(language) => language?.split(FILTER_LABEL_VALUE_DELIMITER)[0]
			) as string[],
		},
		// Maintainers
		{
			field: IeObjectsSearchFilterField.MAINTAINER_ID,
			operator: IeObjectsSearchOperator.IS,
			multiValue: (compact(query[SearchFilterId.Maintainers] || []) as string[]).map(
				(maintainerId: string) =>
					maintainerId.split(FILTER_LABEL_VALUE_DELIMITER)[0] as string
			),
		},
		// Consultable Remote
		{
			field: IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
			operator: IeObjectsSearchOperator.IS,
			value: query[SearchFilterId.ConsultableOnlyOnLocation] ? 'true' : '',
		},
		// Consultable Media
		{
			field: IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
			operator: IeObjectsSearchOperator.IS,
			value: query[SearchFilterId.ConsultableMedia] ? 'true' : '',
		},
		// Advanced
		...(query.advanced || []).flatMap(mapAdvancedToElastic),
	].filter((filterField) => filterField.value || filterField.multiValue?.length);
};

export const mapRefineFilterToElastic = (
	refineFilters: { field: IeObjectsSearchFilterField; value: string }[]
): IeObjectsSearchFilter[] =>
	refineFilters.map(
		({
			field,
			value,
		}: {
			field: IeObjectsSearchFilterField;
			value: string;
		}): IeObjectsSearchFilter => ({
			field: field,
			operator: IeObjectsSearchOperator.CONTAINS,
			value: value,
		})
	);
