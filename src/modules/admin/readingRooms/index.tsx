import { READING_ROOMS_PATHS } from './const';
import { ReadingRoomEdit, ReadingRoomsOverview, Requests, Visitors } from './pages';

export const READING_ROOMS_ROUTES = [
	{ path: READING_ROOMS_PATHS.overview, component: ReadingRoomsOverview },
	{
		path: READING_ROOMS_PATHS.leeszalen,
		component: ReadingRoomsOverview,
	},
	{
		path: READING_ROOMS_PATHS.edit,
		component: ReadingRoomEdit,
	},
	{
		path: READING_ROOMS_PATHS.aanvragen,
		component: Requests,
	},
	{
		path: READING_ROOMS_PATHS.bezoekers,
		component: Visitors,
	},
];
