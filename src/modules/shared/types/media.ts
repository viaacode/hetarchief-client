export type MediaTypes = 'video' | 'audio' | 'film' | null;

export enum VisitorSpaceMediaType {
	All = 'all',
	Audio = 'audio',
	Video = 'video',
}

export enum MediaSearchFilterField {
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
}

export enum MediaSearchOperator {
	CONTAINS = 'contains',
	CONTAINS_NOT = 'containsNot',
	GTE = 'gte',
	IS = 'is',
	IS_NOT = 'isNot',
	LTE = 'lte',
}

export enum License {
	BEZOEKERTOOL_CONTENT = 'BEZOEKERTOOL-CONTENT',
	BEZOEKERTOOL_METADATA_ALL = 'BEZOEKERTOOL-METADATA-ALL',
}

export interface MediaSearchFilter {
	field: MediaSearchFilterField;
	multiValue?: string[];
	operator: MediaSearchOperator;
	value?: string;
}
