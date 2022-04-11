import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { Visit } from '@shared/types';

export function createHomeWithReadingRoomFilterUrl(visit: Visit): string {
	return `${ROUTES.home}?${SEARCH_QUERY_KEY}=${visit.spaceName}`;
}
