import { compact, isString } from 'lodash-es';

import { IeObjectLicense } from '@ie-objects/ie-objects.types';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import type { VisitRequest } from '@shared/types/visit-request';

import { type SearchPageQueryParams, VISITOR_SPACE_QUERY_PARAM_INIT } from '../../const';
import { FILTER_LABEL_VALUE_DELIMITER, type FilterValue, Operator } from '../../types';
import { mapAdvancedToElastic } from '../map-filters';

export const VISITOR_SPACE_LICENSES = [
	IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
	IeObjectLicense.BEZOEKERTOOL_CONTENT,
];

export const mapMaintainerToElastic = (
	query: SearchPageQueryParams,
	activeVisitorSpace: VisitRequest | undefined,
	accessibleVisitorSpaceRequests: VisitRequest[] | undefined
): FilterValue[] => {
	const filterMaintainerSlug = query?.[IeObjectsSearchFilterField.MAINTAINER_SLUG];
	const maintainerId = accessibleVisitorSpaceRequests?.find(
		(visitRequest) => visitRequest.spaceSlug === filterMaintainerSlug
	)?.spaceMaintainerId;

	if (!maintainerId) {
		return [];
	}

	const filterByObjectIds: FilterValue | null =
		(activeVisitorSpace?.accessibleObjectIds?.length || 0) > 0
			? {
					field: IeObjectsSearchFilterField.IDENTIFIER,
					operator: Operator.IS,
					multiValue: activeVisitorSpace?.accessibleObjectIds,
				}
			: null;

	const filterValues = compact([
		{
			field: IeObjectsSearchFilterField.MAINTAINER_ID,
			operator: Operator.IS,
			value: maintainerId,
		},
		// If a visitor space is selected, we only want to show objects that have a visitor space license
		// https://meemoo.atlassian.net/browse/ARC-1655
		{
			field: IeObjectsSearchFilterField.LICENSES,
			operator: Operator.IS,
			multiValue: VISITOR_SPACE_LICENSES,
		},
		// Filter by object ids if the user received folder access to the visitor space
		// https://meemoo.atlassian.net/browse/ARC-1655
		filterByObjectIds,
	]);
	return filterValues as FilterValue[];
};

const getFiltersForSearchTerms = (query: SearchPageQueryParams): FilterValue[] => {
	if (!query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]) {
		return [];
	}
	const searchTerms = isString(query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY])
		? [query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]]
		: query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY];
	return searchTerms.map((searchTerm: string) => {
		return {
			field: IeObjectsSearchFilterField.QUERY,
			operator: Operator.CONTAINS,
			value: searchTerm || '',
		};
	});
};

export const mapFiltersToElastic = (query: SearchPageQueryParams): FilterValue[] => {
	return [
		// Searchbar
		...getFiltersForSearchTerms(query),
		// Tabs
		{
			field: IeObjectsSearchFilterField.FORMAT,
			operator: Operator.IS,
			value: query.format || VISITOR_SPACE_QUERY_PARAM_INIT.format,
		},
		// Medium
		{
			field: IeObjectsSearchFilterField.MEDIUM,
			operator: Operator.IS,
			multiValue: compact(query[IeObjectsSearchFilterField.MEDIUM] || []) as string[],
		},
		// Duration
		...(query[IeObjectsSearchFilterField.DURATION] || []).flatMap(mapAdvancedToElastic),
		// ReleaseDate
		...(query[IeObjectsSearchFilterField.RELEASE_DATE] || []).flatMap(mapAdvancedToElastic),
		// Creator
		{
			field: IeObjectsSearchFilterField.CREATOR,
			operator: Operator.CONTAINS,
			value: (query[IeObjectsSearchFilterField.CREATOR] as string) || '',
		},
		// Newspaper Series Name
		{
			field: IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME,
			operator: Operator.IS,
			value: (query[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME] as string) || '',
		},
		// Location created
		{
			field: IeObjectsSearchFilterField.LOCATION_CREATED,
			operator: Operator.IS,
			value: (query[IeObjectsSearchFilterField.LOCATION_CREATED] as string) || '',
		},
		// Mentions fallen soldiers
		{
			field: IeObjectsSearchFilterField.MENTIONS,
			operator: Operator.IS,
			value: (query[IeObjectsSearchFilterField.MENTIONS] as string) || '',
		},
		// Genre
		{
			field: IeObjectsSearchFilterField.GENRE,
			operator: Operator.IS,
			multiValue: compact(query[IeObjectsSearchFilterField.GENRE] || []) as string[],
		},
		// Keywords
		{
			field: IeObjectsSearchFilterField.KEYWORD,
			operator: Operator.IS,
			multiValue: compact(query[IeObjectsSearchFilterField.KEYWORD] || []) as string[],
		},
		// Language
		{
			field: IeObjectsSearchFilterField.LANGUAGE,
			operator: Operator.IS,
			multiValue: (compact(query[IeObjectsSearchFilterField.LANGUAGE] || []) as string[]).map(
				(language) => language?.split(FILTER_LABEL_VALUE_DELIMITER)[0]
			) as string[],
		},
		// Maintainers
		{
			field: IeObjectsSearchFilterField.MAINTAINER_ID,
			operator: Operator.IS,
			multiValue: (compact(query[IeObjectsSearchFilterField.MAINTAINER_ID] || []) as string[]).map(
				(maintainerId: string) => maintainerId.split(FILTER_LABEL_VALUE_DELIMITER)[0] as string
			),
		},
		// Consultable Remote
		{
			field: IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
			operator: Operator.IS,
			value: query[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION] ? 'true' : '',
		},
		// Consultable Media
		{
			field: IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
			operator: Operator.IS,
			value: query[IeObjectsSearchFilterField.CONSULTABLE_MEDIA] ? 'true' : '',
		},
		// Consultable Public Domain
		{
			field: IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN,
			operator: Operator.IS,
			value: query[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN] ? 'true' : '',
		},
		// Advanced
		...(query.advanced || []).flatMap(mapAdvancedToElastic),
	].filter((filterField) => filterField.value || filterField.multiValue?.length);
};

export const mapRefineFilterToElastic = (
	refineFilters: { field: IeObjectsSearchFilterField; value: string }[]
): FilterValue[] =>
	refineFilters.map(
		({
			field,
			value,
		}: {
			field: IeObjectsSearchFilterField;
			value: string;
		}): FilterValue => ({
			field,
			operator: Operator.CONTAINS,
			val: value,
		})
	);
