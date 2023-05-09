import { compact } from 'lodash-es';

import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import {
	IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	Visit,
} from '@shared/types';

import { VISITOR_SPACE_QUERY_PARAM_INIT } from '../../const';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	VisitorSpaceFilterId,
	VisitorSpaceQueryParams,
} from '../../types';
import { mapAdvancedToElastic } from '../map-filters';

export const mapMaintainerToElastic = (
	query: VisitorSpaceQueryParams,
	activeVisitorSpace: Visit | undefined
): IeObjectsSearchFilter => {
	const maintainerId =
		activeVisitorSpace?.spaceSlug === query?.[VisitorSpaceFilterId.Maintainer]
			? activeVisitorSpace?.spaceMaintainerId
			: '';

	return {
		field: IeObjectsSearchFilterField.MAINTAINER_ID,
		operator: IeObjectsSearchOperator.IS,
		value: maintainerId,
	};
};

export const mapFiltersToElastic = (query: VisitorSpaceQueryParams): IeObjectsSearchFilter[] => [
	// Searchbar
	{
		field: IeObjectsSearchFilterField.QUERY,
		operator: IeObjectsSearchOperator.CONTAINS,
		value:
			query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] !== null
				? query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]?.toString()
				: '',
	},
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
		multiValue: compact(query[VisitorSpaceFilterId.Medium] || []) as string[],
	},
	// Duration
	...(query[VisitorSpaceFilterId.Duration] || []).flatMap(mapAdvancedToElastic),
	// Created
	...(query[VisitorSpaceFilterId.Created] || []).flatMap(mapAdvancedToElastic),
	// Published
	...(query[VisitorSpaceFilterId.Published] || []).flatMap(mapAdvancedToElastic),
	// Creator
	{
		field: IeObjectsSearchFilterField.CREATOR,
		operator: IeObjectsSearchOperator.IS,
		multiValue: compact(query[VisitorSpaceFilterId.Creator] || []) as string[],
	},
	// Genre
	{
		field: IeObjectsSearchFilterField.GENRE,
		operator: IeObjectsSearchOperator.IS,
		multiValue: compact(query[VisitorSpaceFilterId.Genre] || []) as string[],
	},
	// Keywords
	{
		field: IeObjectsSearchFilterField.KEYWORD,
		operator: IeObjectsSearchOperator.IS,
		multiValue: compact(query[VisitorSpaceFilterId.Keywords] || []) as string[],
	},
	// Language
	{
		field: IeObjectsSearchFilterField.LANGUAGE,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (compact(query[VisitorSpaceFilterId.Language] || []) as string[]).map(
			(language) => language?.split(FILTER_LABEL_VALUE_DELIMITER)[0]
		) as string[],
	},
	// Maintainers
	{
		field: IeObjectsSearchFilterField.MAINTAINER_ID,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (compact(query[VisitorSpaceFilterId.Maintainers] || []) as string[]).map(
			(maintainerId: string) => maintainerId.split(FILTER_LABEL_VALUE_DELIMITER)[0] as string
		),
	},
	// Consultable Remote
	{
		field: IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
		operator: IeObjectsSearchOperator.IS,
		value: query[VisitorSpaceFilterId.ConsultableOnlyOnLocation] ? 'true' : '',
	},
	// Consultable Media
	{
		field: IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
		operator: IeObjectsSearchOperator.IS,
		value: query[VisitorSpaceFilterId.ConsultableMedia] ? 'true' : '',
	},
	// Advanced
	...(query.advanced || []).flatMap(mapAdvancedToElastic),
];

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
