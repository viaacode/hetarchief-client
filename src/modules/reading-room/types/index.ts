export enum ReadingRoomMediaType {
	All = 'all',
	Audio = 'audio',
	Video = 'video',
}

export enum ReadingRoomSort {
	Date = 'date',
	Relevance = 'relevance',
	Title = 'title',
}

export interface DefaultFilterFormProps {
	name: string;
}
