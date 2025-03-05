import { compact, isString } from 'lodash-es';

import { IeObjectLicense } from '@ie-objects/ie-objects.types';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import type { VisitRequest } from '@shared/types/visit-request';
import type { SearchPageQueryParams } from '../../const';
import { type FilterValue, Operator } from '../../types';

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
					multiValue: activeVisitorSpace?.accessibleObjectIds || [],
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

export const mapQueryParamsToFilterValues = (query: SearchPageQueryParams): FilterValue[] => {
	const allFilterValues = [
		// 	// Searchbar
		// 	...getFiltersForSearchTerms(query),
		// 	// Format
		// 	{
		// 		field: IeObjectsSearchFilterField.FORMAT,
		// 		operator: Operator.IS,
		// 		multiValue: [query.format || VISITOR_SPACE_QUERY_PARAM_INIT.format],
		// 	},
	];

	const fields = Object.values(IeObjectsSearchFilterField);
	for (const field of fields) {
		const filterValues: FilterValue[] = query[field] || [];
		allFilterValues.push(...filterValues);
	}

	const nonEmptyFilterValues = allFilterValues.filter(
		(filterField) => filterField?.multiValue?.[0]
	);
	return nonEmptyFilterValues;
};
