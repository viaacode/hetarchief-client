import { VISIT_REQUEST_ID_QUERY_KEY } from '@cp/const/requests.const';
import { ROUTES } from '@shared/const';
import { NotificationType } from '@shared/services/notifications-service/notifications.types';

export const NOTIFICATION_TYPE_TO_PATH: Record<NotificationType, string | null> = {
	[NotificationType.NEW_VISIT_REQUEST]: `${ROUTES.beheerRequests}?${VISIT_REQUEST_ID_QUERY_KEY}={visitRequestId}`,
	[NotificationType.VISIT_REQUEST_APPROVED]: '/?scrollTo=planned-visits',
	[NotificationType.VISIT_REQUEST_DENIED]: null,
	[NotificationType.VISIT_REQUEST_CANCELLED]: null,
	[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED]: '/{slug}',
	[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING]: null,
	[NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED]: ROUTES.myHistory,
};
