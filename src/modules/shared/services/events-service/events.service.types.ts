export enum LogEventType {
	// Triggered in FE
	BEZOEK_ITEM_VIEW = 'be.hetarchief.bezoek.item.view',
	BEZOEK_ITEM_PLAY = 'be.hetarchief.bezoek.item.play',
	ITEM_REQUEST = 'be.hetarchief.item.request', // ToDo(Silke): ook versturen voor VRT en UGent, met de info die op dat moment beschikbaar is en de rest leeg laten (dus wel info over het item en de gebruiker, maar niet de info die in het formulier wordt ingevoerd
	ITEM_VIEW = 'be.hetarchief.item.view',
	ITEM_PLAY = 'be.hetarchief.item.play',
	SEARCH = 'be.hetarchief.item.search',
}

export interface LogEvent {
	type: LogEventType;
	path: string;
	data?: Record<string, unknown>;
}
