import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { FC } from 'react';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

import {
	AdvancedFilterForm,
	FilterMenuFilterOption,
	FilterMenuSortOption,
} from '@reading-room/components';
import { Icon } from '@shared/components';
import { SEARCH_QUERY_KEY, VIEW_TOGGLE_OPTIONS } from '@shared/const';
import { OrderDirection, ReadingRoomMediaType } from '@shared/types';

import { DefaultFilterFormProps, ReadingRoomFilterId, ReadingRoomSort } from '../types';

import { AdvancedFilterArrayParam } from './query-params';

export * from './metadata';

export const READING_ROOM_ITEM_COUNT = 100;

export const READING_ROOM_QUERY_PARAM_INIT = {
	format: ReadingRoomMediaType.All,
	orderProp: ReadingRoomSort.Relevance,
	page: 1,
};

export const READING_ROOM_QUERY_PARAM_CONFIG = {
	// Filters
	format: withDefault(StringParam, READING_ROOM_QUERY_PARAM_INIT.format),
	[SEARCH_QUERY_KEY]: ArrayParam,
	[ReadingRoomFilterId.Advanced]: AdvancedFilterArrayParam,
	// Pagination
	page: withDefault(NumberParam, READING_ROOM_QUERY_PARAM_INIT.page),
	// Sorting
	orderProp: withDefault(StringParam, READING_ROOM_QUERY_PARAM_INIT.orderProp),
	orderDirection: StringParam,
};

export const READING_ROOM_TABS = (): TabProps[] => [
	{
		id: ReadingRoomMediaType.All,
		label: i18n?.t('modules/reading-room/const/index___alles'),
	},
	{
		id: ReadingRoomMediaType.Video,
		icon: <Icon name="video" />,
		label: i18n?.t('modules/reading-room/const/index___videos'),
	},
	{
		id: ReadingRoomMediaType.Audio,
		icon: <Icon name="audio" />,
		label: i18n?.t('modules/reading-room/const/index___audio'),
	},
];

export const READING_ROOM_VIEW_TOGGLE_OPTIONS = VIEW_TOGGLE_OPTIONS;

export const READING_ROOM_FILTERS = (): FilterMenuFilterOption[] => [
	{
		id: ReadingRoomFilterId.Format,
		label: i18n?.t('modules/reading-room/const/index___analoge-drager') ?? '',
		form: () => null, // Checkbox list
	},
	{
		id: ReadingRoomFilterId.Duration,
		label: i18n?.t('modules/reading-room/const/index___duurtijd') ?? '',
		form: () => null, // Timepicker hh:mm:ss:SSSS
	},
	{
		id: ReadingRoomFilterId.Created,
		label: i18n?.t('modules/reading-room/const/index___creatiedatum') ?? '',
		form: () => null, // Datetime
	},
	{
		id: ReadingRoomFilterId.Published,
		label: i18n?.t('modules/reading-room/const/index___publicatiedatum') ?? '',
		form: () => null, // Datetime
	},
	{
		id: ReadingRoomFilterId.Creator,
		label: i18n?.t('modules/reading-room/const/index___maker') ?? '',
		form: () => null,
	},
	{
		id: ReadingRoomFilterId.Genre,
		label: i18n?.t('modules/reading-room/const/index___genre') ?? '',
		form: () => null, // Checkbox list
	},
	{
		id: ReadingRoomFilterId.Keywords,
		label: i18n?.t('modules/reading-room/const/index___trefwoorden') ?? '',
		form: () => null, // Text input
	},
	{
		id: ReadingRoomFilterId.Language,
		label: i18n?.t('modules/reading-room/const/index___taal') ?? '',
		form: () => null, // Text input
	},
	{
		id: ReadingRoomFilterId.ImageSound,
		label: i18n?.t('modules/reading-room/const/index___beeld-geluid') ?? '',
		form: () => null, // Boolean yes / no
	},
	{
		id: ReadingRoomFilterId.Advanced,
		icon: 'dots-horizontal',
		label: i18n?.t('modules/reading-room/const/index___geavanceerd') ?? '',
		form: AdvancedFilterForm as FC<DefaultFilterFormProps>, // Custom advanced form
	},
];

export const READING_ROOM_ACTIVE_SORT_MAP = (): { [key in ReadingRoomSort]: string } => ({
	[ReadingRoomSort.Date]: i18n?.t('modules/reading-room/const/index___sorteer-op-datum') ?? '',
	[ReadingRoomSort.Relevance]:
		i18n?.t('modules/reading-room/const/index___sorteer-op-relevantie') ?? '',
	[ReadingRoomSort.Title]: i18n?.t('modules/reading-room/const/index___sorteer-op-titel') ?? '',
});

export const READING_ROOM_SORT_OPTIONS = (): FilterMenuSortOption[] => [
	{
		label: i18n?.t('modules/reading-room/const/index___relevantie') ?? '',
		orderProp: ReadingRoomSort.Relevance,
	},
	{
		label: i18n?.t('modules/reading-room/const/index___datum-oplopend') ?? '',
		orderProp: ReadingRoomSort.Date,
		orderDirection: OrderDirection.asc,
	},
	{
		label: i18n?.t('modules/reading-room/const/index___datum-aflopend') ?? '',
		orderProp: ReadingRoomSort.Date,
		orderDirection: OrderDirection.desc,
	},
	// schema_name niet sorteerbaar in https://meemoo.atlassian.net/wiki/pages/viewpage.action?pageId=3309174878&pageVersion=3
	// {
	// 	label: i18n?.t('modules/reading-room/const/index___van-a-tot-z') ?? '',
	// 	orderProp: ReadingRoomSort.Title,
	// 	orderDirection: OrderDirection.asc,
	// },
	// {
	// 	label: i18n?.t('modules/reading-room/const/index___van-z-tot-a') ?? '',
	// 	orderProp: ReadingRoomSort.Title,
	// 	orderDirection: OrderDirection.desc,
	// },
];
