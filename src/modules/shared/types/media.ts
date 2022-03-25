export type MediaTypes = 'video' | 'audio' | null;

export enum ReadingRoomMediaType {
	All = 'all',
	Audio = 'audio',
	Video = 'video',
}

export enum MediaSearchFilterField {
	QUERY = 'query',
	ADVANCED_QUERY = 'advancedQuery',
	FORMAT = 'format',
	DURATION = 'duration',
	CREATED = 'created',
	PUBLISHED = 'published',
	CREATOR = 'creator',
	GENRE = 'genre',
	KEYWORD = 'keyword',
	NAME = 'name',
}

export enum MediaSearchOperator {
	CONTAINS = 'contains',
	CONTAINS_NOT = 'containsNot',
	IS = 'is',
	IS_NOT = 'isNot',
	GTE = 'gte',
	LTE = 'lte',
}

export interface MediaSearchFilter {
	field: MediaSearchFilterField;
	multiValue?: string[];
	value?: string;
	operator: MediaSearchOperator;
}

export type MediaSearchFilters = MediaSearchFilter[];
