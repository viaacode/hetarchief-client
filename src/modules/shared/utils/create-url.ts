import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { VisitInfo } from '@shared/types';

export function createHomeWithReadingRoomFilterUrl(visit: VisitInfo): string {
	return `${ROUTES.home}?${SEARCH_QUERY_KEY}=${visit.spaceName}`;
}
