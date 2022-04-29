import { VISIT_REQUEST_ID_QUERY_KEY } from '@cp/const/requests.const';
import { ROUTES } from '@shared/const';
import { NotificationType } from '@shared/services/notifications-service/notifications.types';

export const NOTIFICATION_TYPE_TO_PATH: Record<NotificationType, string | null> = {
	[NotificationType.NEW_VISIT_REQUEST]: `${ROUTES.beheerRequests}?${VISIT_REQUEST_ID_QUERY_KEY}={visitRequestId}`,
	[NotificationType.VISIT_REQUEST_APPROVED]: '/',
	[NotificationType.VISIT_REQUEST_DENIED]: null,
	[NotificationType.VISIT_REQUEST_CANCELLED]: null,
	[NotificationType.ACCESS_PERIOD_READING_ROOM_STARTED]: '/{slug}',
	[NotificationType.ACCESS_PERIOD_READING_ROOM_END_WARNING]: null,
	[NotificationType.ACCESS_PERIOD_READING_ROOM_ENDED]: ROUTES.myHistory,
};
