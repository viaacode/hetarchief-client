import { IeObjectLicense } from '@ie-objects/ie-objects.types';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	SearchPageMediaType,
} from '@shared/types/ie-objects';
import type { VisitRequest } from '@shared/types/visit-request';
import type { FilterMenuFilterOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { ALL_SEARCH_FILTERS } from '@visitor-space/const/visitor-space-filters.const';
import { compact, isNil, isString } from 'es-toolkit/compat';

import type { SearchPageQueryParams } from '../../const';
import {
	type AdvancedFilter,
	FILTER_LABEL_VALUE_DELIMITER,
	FilterModalType,
	Operator,
	SearchFilterId,
	type TextFilterCondition,
} from '../../types';
import { mapAdvancedToElastic } from '../map-filters';

export const VISITOR_SPACE_LICENSES = [
	IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
	IeObjectLicense.BEZOEKERTOOL_CONTENT,
];

export const mapMaintainerToElastic = (
	query: SearchPageQueryParams,
	activeVisitorSpace: VisitRequest | null | undefined,
	accessibleVisitorSpaceRequests: VisitRequest[] | undefined
): IeObjectsSearchFilter[] => {
	const filterMaintainerSlug = query?.[SearchFilterId.Maintainer];
	const maintainerId = accessibleVisitorSpaceRequests?.find(
		(visitRequest) => visitRequest.spaceSlug === filterMaintainerSlug
	)?.spaceMaintainerId;

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

const getFiltersForFormat = (query: SearchPageQueryParams): IeObjectsSearchFilter[] => {
	if (!query.format) {
		return [];
	}
	const formatValue = query.format;
	if (formatValue === SearchPageMediaType.All) {
		return [];
	}
	return [
		{
			field: IeObjectsSearchFilterField.FORMAT,
			operator: IeObjectsSearchOperator.IS,
			value: formatValue || '',
		},
	];
};

/**
 * The clauses one filter contributes. Values inside one filter are sent as one multiValue, or as
 * one clause per text condition; the proxy or-s them. https://meemoo.atlassian.net/browse/ARC-3806
 */
const mapFilterToElastic = (
	query: SearchPageQueryParams,
	filter: FilterMenuFilterOption
): IeObjectsSearchFilter[] => {
	const value = query[filter.id];

	if (isNil(value) || !filter.field) {
		return [];
	}

	switch (filter.modalType) {
		case FilterModalType.Text:
			return (value as TextFilterCondition[]).map((condition) => ({
				field: filter.field as IeObjectsSearchFilterField,
				operator:
					condition.op === Operator.CONTAINS_NOT
						? IeObjectsSearchOperator.CONTAINS_NOT
						: IeObjectsSearchOperator.CONTAINS,
				value: condition.val,
			}));

		case FilterModalType.SearchableCheckbox:
		case FilterModalType.CheckboxList:
		case FilterModalType.Autocomplete:
			return [
				{
					field: filter.field,
					operator: IeObjectsSearchOperator.IS,
					// A stored value can carry its own label, eg "OR-rf5kf25---VRT"
					multiValue: (
						compact(isString(value) ? [value] : (value as (string | null)[])) as string[]
					).map((entry) => entry.split(FILTER_LABEL_VALUE_DELIMITER)[0] as string),
				},
			];

		default:
			// The boolean, date and duration filters the FA leaves as they are
			if (typeof value === 'boolean') {
				return [
					{
						field: filter.field,
						operator: IeObjectsSearchOperator.IS,
						value: value ? 'true' : '',
					},
				];
			}
			return (value as AdvancedFilter[]).flatMap(mapAdvancedToElastic);
	}
};

export const mapFiltersToElastic = (query: SearchPageQueryParams): IeObjectsSearchFilter[] => {
	const allFilters: IeObjectsSearchFilter[] = [
		// Searchbar
		...getFiltersForSearchTerms(query),
		// Tabs
		...getFiltersForFormat(query),
		...ALL_SEARCH_FILTERS().flatMap((filter) => mapFilterToElastic(query, filter)),
		// Urls shared before ARC-3806 may still carry the old combined parameter
		...(query[SearchFilterId.Advanced] || []).flatMap(mapAdvancedToElastic),
	];

	const nonEmptyFilters = allFilters.filter(
		(filterField) => filterField.value || filterField.multiValue?.length
	);
	return nonEmptyFilters;
};
