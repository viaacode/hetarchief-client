import { READING_ROOMS_PATHS } from './const';
import { ReadingRoomsOverview, Requests } from './pages';

export const READING_ROOMS_ROUTES = [
	{ path: READING_ROOMS_PATHS.overview, component: ReadingRoomsOverview },
	{ path: `${READING_ROOMS_PATHS.overview}/alleleeszalen`, component: ReadingRoomsOverview },
	{ path: `${READING_ROOMS_PATHS.overview}/aanvragen`, component: Requests },
];
