import { ROUTE_PARTS, ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { Visit } from '@shared/types';

export function createVisitorSpacesWithFilterUrl(visit: Visit): string {
	return `/${ROUTE_PARTS.visit}?${SEARCH_QUERY_KEY}=${visit.spaceName}`;
}
