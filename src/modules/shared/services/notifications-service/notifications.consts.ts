import { VISIT_REQUEST_ID_QUERY_KEY } from '@cp/const/requests.const';
import { ROUTE_PARTS, ROUTES } from '@shared/const';
import { NotificationType } from '@shared/services/notifications-service/notifications.types';
import { VisitorSpaceFilterId } from '@visitor-space/types';

export const GET_PATH_FROM_NOTIFICATION_TYPE = (): Record<NotificationType, string | null> => {
	return {
		[NotificationType.NEW_VISIT_REQUEST]: `${ROUTES.beheerRequests}?${VISIT_REQUEST_ID_QUERY_KEY}={visitRequestId}`,
		[NotificationType.VISIT_REQUEST_APPROVED]: '/bezoek#aangevraagde-bezoeken',
		[NotificationType.VISIT_REQUEST_DENIED]: null,
		[NotificationType.VISIT_REQUEST_CANCELLED]: null,

		// Absolute url, so we force reload the page, so the active visitor spaces are reloaded
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED]: `${window.location.origin}/${ROUTE_PARTS.search}?${VisitorSpaceFilterId.Maintainer}={slug}`,
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING]: null,
		[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED]: ROUTES.myHistory,
		[NotificationType.MAINTENANCE_ALERT]: null,
	};
};
