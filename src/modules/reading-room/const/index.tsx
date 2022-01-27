import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

import { Icon, IconProps } from '@shared/components';

import { ReadingRoomMediaType } from '../types';

export const READING_ROOM_ITEM_COUNT = 100;

export const READING_ROOM_QUERY_PARAM_CONFIG = {
	mediaType: withDefault(StringParam, ReadingRoomMediaType.All),
	search: ArrayParam,
	start: withDefault(NumberParam, 0),
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
