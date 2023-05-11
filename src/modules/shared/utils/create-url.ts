import { ROUTE_PARTS } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { Visit } from '@shared/types';

export function createVisitorSpacesWithFilterUrl(visit: Visit): string {
	return `/${ROUTE_PARTS.visit}?${QUERY_PARAM_KEY.SEARCH_QUERY_KEY}=${visit.spaceName}`;
}
