import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { type VisitRequest } from '@shared/types/visit-request';
import { type Locale } from '@shared/utils/i18n';

export function createVisitorSpacesWithFilterUrl(visit: VisitRequest, locale: Locale): string {
	return `/${ROUTE_PARTS_BY_LOCALE[locale].visit}?${QUERY_PARAM_KEY.SEARCH_QUERY_KEY}=${visit.spaceName}`;
}
