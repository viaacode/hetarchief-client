export enum LogEventType {
	USER_AUTHENTICATE = 'be.hetarchief.bezoek.user.authenticate', // Triggered in backend
	ITEM_VIEW = 'be.hetarchief.bezoek.item.view',
	ITEM_PLAY = 'be.hetarchief.bezoek.item.play',
	ITEM_BOOKMARK = 'be.hetarchief.bezoek.item.bookmark', // Triggered in backend
	METADATA_EXPORT = 'be.hetarchief.bezoek.metadata.export', // Triggered in backend
	VISIT_REQUEST = 'be.hetarchief.bezoek.visit.request', // Triggered in backend
	VISIT_REQUEST_APPROVED = 'be.hetarchief.bezoek.visit.approve', // Triggered in backend
	VISIT_REQUEST_DENIED = 'be.hetarchief.bezoek.visit.disapprove', // Triggered in backend
	VISIT_REQUEST_CANCELLED_BY_VISITOR = 'be.hetarchief.bezoek.visit.cancel', // Triggered in backend
	VISIT_REQUEST_REVOKED = 'be.hetarchief.bezoek.visit.revoke', // Triggered in backend
	SEARCH = 'be.hetarchief.bezoek.search',
}

export interface LogEvent {
	type: LogEventType;
	path: string;
	data?: Record<string, unknown>;
}
