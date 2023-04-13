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
	ERA = 'era',
	FORMAT = 'format',
	GENRE = 'genre',
	KEYWORD = 'keyword',
	LANGUAGE = 'language',
	LOCATION = 'location',
	MEDIUM = 'medium',
	NAME = 'name',
	PUBLISHED = 'published',
	PUBLISHER = 'publisher',
	QUERY = 'query',
	// TODO future: rename maintainer to maintainerId and maintainers to maintainerName and also change this in the client
	MAINTAINER_ID = 'maintainer', // Contains the OR-id of the maintainer
	MAINTAINERS_NAME = 'maintainers', // Contains the name of the maintainer
	CONSULTABLE_ONLY_ON_LOCATION = 'isConsultableOnlyOnLocation',
	CONSULTABLE_MEDIA = 'isConsultableMedia',
	CAST = 'cast',
	CAPTION = 'caption',
	TRANSCRIPT = 'transcript',
	CATEGORIE = 'categorie',
	TYPE = 'type',
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
