export enum LogEventType {
	// Triggered in the frontend
	BEZOEK_ITEM_VIEW = 'be.hetarchief.bezoek.item.view',
	BEZOEK_ITEM_PLAY = 'be.hetarchief.bezoek.item.play',
	BEZOEK_SEARCH = 'be.hetarchief.bezoek.search',
	ITEM_REQUEST = 'be.hetarchief.item.request',
	ITEM_VIEW = 'be.hetarchief.item.view',
	ITEM_PLAY = 'be.hetarchief.item.play',
	SEARCH = 'be.hetarchief.item.search',
	DOWNLOAD = 'be.hetarchief.item.download',

	// Triggered in the backend
	USER_AUTHENTICATE = 'be.hetarchief.user.authenticate',
	ITEM_BOOKMARK = 'be.hetarchief.item.bookmark',
	METADATA_EXPORT = 'be.hetarchief.bezoek.metadata.export',
	VISIT_REQUEST = 'be.hetarchief.bezoek.visit.request',
	VISIT_REQUEST_APPROVED = 'be.hetarchief.bezoek.visit.approve',
	VISIT_REQUEST_DENIED = 'be.hetarchief.bezoek.visit.disapprove',
	VISIT_REQUEST_CANCELLED_BY_VISITOR = 'be.hetarchief.bezoek.visit.cancel',
	VISIT_REQUEST_REVOKED = 'be.hetarchief.bezoek.visit.revoke',
	NEWSLETTER_SUBSCRIBE = 'be.hetarchief.user.newslettersubscribe',
}

export interface LogEvent {
	type: LogEventType;
	path: string;
	data?: Record<string, unknown>;
}
