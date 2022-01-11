import { ArrayParam, StringParam, withDefault } from 'use-query-params';

import { Icon } from '@shared/components';

import { ReadingRoomMediaType } from '../types';

export const READING_ROOM_QUERY_PARAM_CONFIG = {
	mediaType: withDefault(StringParam, ReadingRoomMediaType.All),
	search: ArrayParam,
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
