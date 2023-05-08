export type IeObjectTypes = 'video' | 'audio' | 'film' | null;

export enum VisitorSpaceMediaType {
	All = 'all',
	Audio = 'audio',
	Video = 'video',
}

export enum IeObjectsSearchFilterField {
	ADVANCED_QUERY = 'advancedQuery',
	CREATED = 'created',
	CREATOR = 'creator',
	DESCRIPTION = 'description',
	DURATION = 'duration',
	SPACIAL_COVERAGE = 'spacialCoverage',
	TEMPORAL_COVERAGE = 'temporalCoverage',
	FORMAT = 'format',
	GENRE = 'genre',
	KEYWORD = 'keyword',
	LANGUAGE = 'language',
	MEDIUM = 'medium',
	NAME = 'name',
	PUBLISHED = 'published',
	PUBLISHER = 'publisher',
	QUERY = 'query',
	// TODO future: rename maintainer to maintainerId and maintainers to maintainerName and also change this in the client
	MAINTAINER_ID = 'maintainer', // Contains the OR-id of the maintainer
	CONSULTABLE_ONLY_ON_LOCATION = 'isConsultableOnlyOnLocation',
	CONSULTABLE_MEDIA = 'isConsultableMedia',
	CAST = 'cast',
	IDENTIFIER = 'identifier',
	OBJECT_TYPE = 'objectType',
	CAPTION = 'caption', // Not available in database: https://docs.google.com/spreadsheets/d/1xAtHfkpDi4keSsBol7pw0cQAvCmg2hWRz8oxM6cP7zo/edit#gid=0
	TRANSCRIPT = 'transcript', // Not available in database: https://docs.google.com/spreadsheets/d/1xAtHfkpDi4keSsBol7pw0cQAvCmg2hWRz8oxM6cP7zo/edit#gid=0
	CATEGORIE = 'categorie', // Not available in database: https://docs.google.com/spreadsheets/d/1xAtHfkpDi4keSsBol7pw0cQAvCmg2hWRz8oxM6cP7zo/edit#gid=0
}

export enum IeObjectsSearchOperator {
	CONTAINS = 'contains',
	CONTAINS_NOT = 'containsNot',
	GTE = 'gte',
	IS = 'is',
	IS_NOT = 'isNot',
	LTE = 'lte',
}

export interface IeObjectsSearchFilter {
	field: IeObjectsSearchFilterField;
	multiValue?: string[];
	operator: IeObjectsSearchOperator;
	value?: string;
}
