export enum NotificationStatus {
	UNREAD = 'UNREAD',
	READ = 'READ',
}

export enum NotificationType {
	VISIT_REQUEST_APPROVED = 'VISIT_REQUEST_APPROVED',
	VISIT_REQUEST_DENIED = 'VISIT_REQUEST_DENIED',
	NEW_VISIT_REQUEST = 'NEW_VISIT_REQUEST',
	VISIT_REQUEST_CANCELLED = 'VISIT_REQUEST_CANCELLED',
	ACCESS_PERIOD_READING_ROOM_STARTED = 'ACCESS_PERIOD_READING_ROOM_STARTED',
	ACCESS_PERIOD_READING_ROOM_END_WARNING = 'ACCESS_PERIOD_READING_ROOM_END_WARNING',
	ACCESS_PERIOD_READING_ROOM_ENDED = 'ACCESS_PERIOD_READING_ROOM_ENDED',
}

export interface Notification {
	description: string;
	title: string;
	id: string;
	status: NotificationStatus;
	visitId: string;
	createdAt: string;
	updatedAt: string;
	type: NotificationType;
	visitorSpaceSlug: string;
}

export interface MarkAllAsReadResult {
	status: string;
	total: number;
}
