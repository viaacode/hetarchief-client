export enum NotificationStatus {
	UNREAD = 'UNREAD',
	READ = 'READ',
}

export enum NotificationType {
	VISIT_REQUEST_APPROVED = 'VISIT_REQUEST_APPROVED',
	VISIT_REQUEST_DENIED = 'VISIT_REQUEST_DENIED',
	NEW_VISIT_REQUEST = 'NEW_VISIT_REQUEST',
	VISIT_REQUEST_CANCELLED = 'VISIT_REQUEST_CANCELLED',
	START_ACCESS_PERIOD_READING_ROOM = 'START_ACCESS_PERIOD_READING_ROOM',
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
	showAt: string;
	readingRoomId: string;
}

export interface MarkAllAsReadResult {
	status: string;
	total: number;
}
