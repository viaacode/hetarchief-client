import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { Visit } from '@shared/types';
import { Locale } from '@shared/utils/i18n';

export function createVisitorSpacesWithFilterUrl(visit: Visit, locale: Locale): string {
	return `/${ROUTE_PARTS_BY_LOCALE[locale].visit}?${QUERY_PARAM_KEY.SEARCH_QUERY_KEY}=${visit.spaceName}`;
}
