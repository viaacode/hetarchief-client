import { NotificationType } from '@shared/services/notifications-service/notifications.types';

export const NOTIFICATION_TYPE_TO_PATH: Record<NotificationType, string> = {
	[NotificationType.NEW_VISIT_REQUEST]: '/beheer/aanvragen?visitRequest={visitRequestId}',
	[NotificationType.VISIT_REQUEST_APPROVED]: '/leeszaal/{readingRoomId}',
	[NotificationType.VISIT_REQUEST_DENIED]: '/leeszaal/{readingRoomId}',
	[NotificationType.VISIT_REQUEST_CANCELLED]: '/leeszaal/{readingRoomId}',
	[NotificationType.START_ACCESS_PERIOD_READING_ROOM]: '/leeszaal/{readingRoomId}',
};
