import { i18n } from 'next-i18next';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

import { FilterMenuSortOption } from '@reading-room/components';
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

export const READING_ROOM_ACTIVE_SORT_MAP = (): { [key in ReadingRoomSort]: string } => ({
	date: i18n?.t('sorteer op Datum') ?? '',
	relevance: i18n?.t('sorteer op Relevantie') ?? '',
	title: i18n?.t('sorteer op Titel') ?? '',
});

export const READING_ROOM_SORT_OPTIONS = (): FilterMenuSortOption[] => [
	{
		label: i18n?.t('Relevantie') ?? '',
		sort: ReadingRoomSort.Relevance,
	},
	{
		label: i18n?.t('Datum oplopend') ?? '',
		sort: ReadingRoomSort.Date,
		order: 'asc',
	},
	{
		label: i18n?.t('Datum aflopend') ?? '',
		sort: ReadingRoomSort.Date,
		order: 'desc',
	},
	{
		label: i18n?.t('Van A tot Z') ?? '',
		sort: ReadingRoomSort.Title,
		order: 'asc',
	},
	{
		label: i18n?.t('Van Z tot A') ?? '',
		sort: ReadingRoomSort.Title,
		order: 'desc',
	},
];
