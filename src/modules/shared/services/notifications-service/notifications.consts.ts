import { VISIT_REQUEST_ID_QUERY_KEY } from '@cp/const/requests.const';
import { ROUTE_PARTS_BY_LOCALE, ROUTES_BY_LOCALE } from '@shared/const';
import { NotificationType } from '@shared/services/notifications-service/notifications.types';
import { Locale } from '@shared/utils';
import { VisitorSpaceFilterId } from '@visitor-space/types';

export const GET_PATH_FROM_NOTIFICATION_TYPE = (
	locale: Locale
): Record<NotificationType, string | null> => {
	return {
		[NotificationType.NEW_VISIT_REQUEST]: `${ROUTES_BY_LOCALE[locale].cpAdminVisitRequests}?${VISIT_REQUEST_ID_QUERY_KEY}={visitRequestId}`,
		[NotificationType.VISIT_REQUEST_APPROVED]: `/${ROUTES_BY_LOCALE[locale].visit}#aangevraagde-bezoeken`,
		[NotificationType.VISIT_REQUEST_DENIED]: null,
		[NotificationType.VISIT_REQUEST_CANCELLED]: null,

		// Absolute url, so we force reload the page, so the active visitor spaces are reloaded
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED]: `${window.location.origin}/${ROUTE_PARTS_BY_LOCALE[locale].search}?${VisitorSpaceFilterId.Maintainer}={slug}`,
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING]: null,
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED]: ROUTES_BY_LOCALE[locale].myHistory,
		[NotificationType.MAINTENANCE_ALERT]: null,
	};
};
