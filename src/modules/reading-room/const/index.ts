import { StringParam, withDefault } from 'use-query-params';

import { ReadingRoomMediaType } from '../types';

export const READING_ROOM_QUERY_PARAM_CONFIG = {
	mediaType: withDefault(StringParam, ReadingRoomMediaType.All),
};

export const READING_ROOM_TABS = [
	{
		id: ReadingRoomMediaType.All,
		label: 'Alles',
	},
	{
		id: ReadingRoomMediaType.Video,
		icon: 'video',
		label: "Video's",
	},
	{
		id: ReadingRoomMediaType.Audio,
		icon: 'audio',
		label: 'Audio',
	},
];
