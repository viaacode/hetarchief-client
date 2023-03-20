import {
	IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
} from '@shared/types';

import { VISITOR_SPACE_QUERY_PARAM_INIT } from '../../const';
import { VisitorSpaceFilterId, VisitorSpaceQueryParams } from '../../types';
import { mapAdvancedToElastic } from '../map-filters';

export const mapFiltersToElastic = (query: VisitorSpaceQueryParams): IeObjectsSearchFilter[] => [
	// Visitor space
	{
		field: IeObjectsSearchFilterField.MAINTAINER,
		operator: IeObjectsSearchOperator.IS,
		value:
			query[VisitorSpaceFilterId.Maintainer] !== null
				? query[VisitorSpaceFilterId.Maintainer]?.toString()
				: '',
	},
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
		field: IeObjectsSearchFilterField.MAINTAINERS,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (query[VisitorSpaceFilterId.Maintainers] || []).filter(
			(item) => item !== null
		) as string[],
	},
	// Consultable Remote
	{
		field: IeObjectsSearchFilterField.REMOTE,
		operator: IeObjectsSearchOperator.IS,
		value:
			// Because the UI doesn't match with the BE property (on site vs remote), we need to pass the opposite value of the remote boolean
			query[VisitorSpaceFilterId.Remote] !== null
				? (!query[VisitorSpaceFilterId.Remote])?.toString()
				: 'true',
	},
	// Advanced
	...(query.advanced || []).flatMap(mapAdvancedToElastic),
];
