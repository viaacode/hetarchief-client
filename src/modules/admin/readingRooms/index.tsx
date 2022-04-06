import { generatePath } from 'react-router-dom';

import { READING_ROOMS_PATHS } from './const';
import { ReadingRoomEdit, ReadingRoomsOverview, Requests } from './pages';

export const READING_ROOMS_ROUTES = [
	{ path: READING_ROOMS_PATHS.overview, component: ReadingRoomsOverview },
	{
		path: generatePath(READING_ROOMS_PATHS.detail, {
			pageName: 'leeszalen',
		}),
		component: ReadingRoomsOverview,
	},
	{
		path: generatePath(READING_ROOMS_PATHS.edit, {
			pageName: ':id',
		}),
		component: ReadingRoomEdit,
	},
	{
		path: generatePath(READING_ROOMS_PATHS.detail, {
			pageName: 'aanvragen',
		}),
		component: Requests,
	},
];
