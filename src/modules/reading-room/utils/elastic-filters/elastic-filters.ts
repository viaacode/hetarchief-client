import { READING_ROOM_QUERY_PARAM_INIT } from '@reading-room/const';
import { ReadingRoomQueryParams } from '@reading-room/types';
import { MediaSearchFilter, MediaSearchFilterField, MediaSearchOperator } from '@shared/types';

import { mapAdvancedToElastic } from '../map-filters';

export const mapFiltersToElastic = (query: ReadingRoomQueryParams): MediaSearchFilter[] => [
	// Searchbar
	{
		field: MediaSearchFilterField.QUERY,
		operator: MediaSearchOperator.CONTAINS,
		value: query.search !== null ? query.search?.toString() : '',
	},
	// Tabs
	{
		field: MediaSearchFilterField.FORMAT,
		operator: MediaSearchOperator.IS,
		value: query.format || READING_ROOM_QUERY_PARAM_INIT.format,
	},
	// Medium TODO
	// {
	// 	field: MediaSearchFilterField.MEDIUM,
	// 	operator: MediaSearchOperator.IS,
	// 	multiValue: (query.medium || []).filter((item) => item !== null) as string[],
	// },
	// Duration
	...(query.duration || []).flatMap(mapAdvancedToElastic),
	// Created
	...(query.created || []).flatMap(mapAdvancedToElastic),
	// Published
	...(query.published || []).flatMap(mapAdvancedToElastic),
	// Creator
	{
		field: MediaSearchFilterField.CREATOR,
		operator: MediaSearchOperator.IS,
		multiValue: (query.creator || []).filter((item) => item !== null) as string[],
	},
	// Genre
	{
		field: MediaSearchFilterField.GENRE,
		operator: MediaSearchOperator.IS,
		multiValue: (query.genre || []).filter((item) => item !== null) as string[],
	},
	// Keywords
	{
		field: MediaSearchFilterField.KEYWORD,
		operator: MediaSearchOperator.IS,
		multiValue: (query.keywords || []).filter((item) => item !== null) as string[],
	},
	// Language TODO
	// {
	// 	field: MediaSearchFilterField.LANGUAGE,
	// 	operator: MediaSearchOperator.IS,
	// 	multiValue: (query.language || []).filter((item) => item !== null) as string[],
	// },
	// Advanced
	...(query.advanced || []).flatMap(mapAdvancedToElastic),
];
