export enum LogEventType {
	// Triggered in FE
	BEZOEK_ITEM_VIEW = 'be.hetarchief.bezoek.item.view',
	BEZOEK_ITEM_PLAY = 'be.hetarchief.bezoek.item.play',
	ITEM_REQUEST = 'be.hetarchief.item.request',
	ITEM_VIEW = 'be.hetarchief.item.view',
	ITEM_PLAY = 'be.hetarchief.item.play',
	SEARCH = 'be.hetarchief.item.search',
}

export interface LogEvent {
	type: LogEventType;
	path: string;
	data?: Record<string, unknown>;
}
