import { i18n } from 'next-i18next';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

import { FilterMenuFilterOption, FilterMenuSortOption } from '@reading-room/components';
import { Icon, IconProps } from '@shared/components';

import { ReadingRoomMediaType, ReadingRoomSort } from '../types';

export const READING_ROOM_ITEM_COUNT = 100;

export const READING_ROOM_QUERY_PARAM_INIT = {
	mediaType: ReadingRoomMediaType.All,
	sort: ReadingRoomSort.Relevance,
	start: 0,
};

export const READING_ROOM_QUERY_PARAM_CONFIG = {
	mediaType: withDefault(StringParam, READING_ROOM_QUERY_PARAM_INIT.mediaType),
	search: ArrayParam,
	start: withDefault(NumberParam, READING_ROOM_QUERY_PARAM_INIT.start),
	sort: withDefault(StringParam, READING_ROOM_QUERY_PARAM_INIT.sort),
	order: StringParam,
};

export const READING_ROOM_TABS = [
	{
		id: ReadingRoomMediaType.All,
		label: 'Alles',
	},
	{
		id: ReadingRoomMediaType.Video,
		icon: <Icon name="video" />,
		label: "Video's",
	},
	{
		id: ReadingRoomMediaType.Audio,
		icon: <Icon name="audio" />,
		label: 'Audio',
	},
];

export const READING_ROOM_VIEW_TOGGLE_OPTIONS = [
	{
		id: 'grid',
		iconName: 'grid-view' as IconProps['name'],
	},
	{
		id: 'list',
		iconName: 'list-view' as IconProps['name'],
	},
];

export const READING_ROOM_FILTERS = (): FilterMenuFilterOption[] => [
	{
		id: 'format',
		label: i18n?.t('modules/reading-room/const/index___analoge-drager') ?? '',
		form: () => null, // Checkbox list
	},
	{
		id: 'duration',
		label: i18n?.t('modules/reading-room/const/index___duurtijd') ?? '',
		form: () => null, // Timepicker hh:mm:ss:SSSS
	},
	{
		id: 'created',
		label: i18n?.t('modules/reading-room/const/index___creatiedatum') ?? '',
		form: () => null, // Datetime
	},
	{
		id: 'published',
		label: i18n?.t('modules/reading-room/const/index___publicatiedatum') ?? '',
		form: () => null, // Datetime
	},
	{
		id: 'creator',
		label: i18n?.t('modules/reading-room/const/index___maker') ?? '',
		form: () => null,
	},
	{
		id: 'genre',
		label: i18n?.t('modules/reading-room/const/index___genre') ?? '',
		form: () => null, // Checkbox list
	},
	{
		id: 'keywords',
		label: i18n?.t('modules/reading-room/const/index___trefwoorden') ?? '',
		form: () => null, // Text input
	},
	{
		id: 'language',
		label: i18n?.t('modules/reading-room/const/index___taal') ?? '',
		form: () => null, // Text input
	},
	{
		id: 'image-sound',
		label: i18n?.t('modules/reading-room/const/index___beeld-geluid') ?? '',
		form: () => null, // Boolean yes / no
	},
];

export const READING_ROOM_ACTIVE_SORT_MAP = (): { [key in ReadingRoomSort]: string } => ({
	date: i18n?.t('modules/reading-room/const/index___sorteer-op-datum') ?? '',
	relevance: i18n?.t('modules/reading-room/const/index___sorteer-op-relevantie') ?? '',
	title: i18n?.t('modules/reading-room/const/index___sorteer-op-titel') ?? '',
});

export const READING_ROOM_SORT_OPTIONS = (): FilterMenuSortOption[] => [
	{
		label: i18n?.t('modules/reading-room/const/index___relevantie') ?? '',
		sort: ReadingRoomSort.Relevance,
	},
	{
		label: i18n?.t('modules/reading-room/const/index___datum-oplopend') ?? '',
		sort: ReadingRoomSort.Date,
		order: 'asc',
	},
	{
		label: i18n?.t('modules/reading-room/const/index___datum-aflopend') ?? '',
		sort: ReadingRoomSort.Date,
		order: 'desc',
	},
	{
		label: i18n?.t('modules/reading-room/const/index___van-a-tot-z') ?? '',
		sort: ReadingRoomSort.Title,
		order: 'asc',
	},
	{
		label: i18n?.t('modules/reading-room/const/index___van-z-tot-a') ?? '',
		sort: ReadingRoomSort.Title,
		order: 'desc',
	},
];
