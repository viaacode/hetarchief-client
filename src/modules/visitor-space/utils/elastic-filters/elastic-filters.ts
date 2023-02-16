import {
	IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
} from '@shared/types';

import { VISITOR_SPACE_QUERY_PARAM_INIT } from '../../const';
import { VisitorSpaceQueryParams } from '../../types';
import { mapAdvancedToElastic } from '../map-filters';

export const mapFiltersToElastic = (query: VisitorSpaceQueryParams): IeObjectsSearchFilter[] => [
	// Visitor space
	{
		field: IeObjectsSearchFilterField.MAINTAINER,
		operator: IeObjectsSearchOperator.IS,
		value: query.maintainer !== null ? query.maintainer?.toString() : '',
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
		multiValue: (query.medium || []).filter((item) => item !== null) as string[],
	},
	// Duration
	...(query.duration || []).flatMap(mapAdvancedToElastic),
	// Created
	...(query.created || []).flatMap(mapAdvancedToElastic),
	// Published
	...(query.published || []).flatMap(mapAdvancedToElastic),
	// Creator
	{
		field: IeObjectsSearchFilterField.CREATOR,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (query.creator || []).filter((item) => item !== null) as string[],
	},
	// Genre
	{
		field: IeObjectsSearchFilterField.GENRE,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (query.genre || []).filter((item) => item !== null) as string[],
	},
	// Keywords
	{
		field: IeObjectsSearchFilterField.KEYWORD,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (query.keywords || []).filter((item) => item !== null) as string[],
	},
	// Language
	{
		field: IeObjectsSearchFilterField.LANGUAGE,
		operator: IeObjectsSearchOperator.IS,
		multiValue: (query.language || []).filter((item) => item !== null) as string[],
	},
	// Advanced
	...(query.advanced || []).flatMap(mapAdvancedToElastic),
];
