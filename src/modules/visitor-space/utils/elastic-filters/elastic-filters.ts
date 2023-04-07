import {
	IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	Visit,
} from '@shared/types';

import { VISITOR_SPACE_QUERY_PARAM_INIT } from '../../const';
import { VisitorSpaceFilterId, VisitorSpaceQueryParams } from '../../types';
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
		value: query.search !== null ? query.search?.toString() : '',
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
		multiValue: (query[VisitorSpaceFilterId.Medium] || []).filter(
			(item) => item !== null
		) as string[],
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
		multiValue: (query[VisitorSpaceFilterId.Creator] || []).filter(
			(item) => item !== null
		) as string[],
	},
	// Genre
	{
		field: IeObjectsSearchFilterField.GENRE,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (query[VisitorSpaceFilterId.Genre] || []).filter(
			(item) => item !== null
		) as string[],
	},
	// Keywords
	{
		field: IeObjectsSearchFilterField.KEYWORD,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (query[VisitorSpaceFilterId.Keywords] || []).filter(
			(item) => item !== null
		) as string[],
	},
	// Language
	{
		field: IeObjectsSearchFilterField.LANGUAGE,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (query[VisitorSpaceFilterId.Language] || []).filter(
			(item) => item !== null
		) as string[],
	},
	// Maintainers
	{
		field: IeObjectsSearchFilterField.MAINTAINERS_NAME,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (query[VisitorSpaceFilterId.Maintainers] || []).filter(
			(item) => item !== null
		) as string[],
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
