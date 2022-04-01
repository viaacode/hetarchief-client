export type MediaTypes = 'video' | 'audio' | 'film' | null;

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

export interface MediaInfo {
	meemoo_fragment_id: string; // Unique id per object
	schema_identifier: string; // PID (this is not unique per objects)
	schema_in_language: unknown | null;
	dcterms_available: string;
	schema_creator?: {
		Archiefvormer?: string[];
		productionCompany?: string[];
		Maker?: string[];
	};
	schema_description?: string;
	schema_publisher?: {
		Publisher: string[];
	};
	schema_duration: string;
	schema_abstract?: string;
	premis_identifier: string;
	schema_genre?: string;
	schema_date_published?: string;
	schema_license?: string[];
	schema_date_created?: string;
	schema_contributor: unknown | null;
	schema_maintainer?: {
		schema_identifier: string;
	};
	dcterms_format: MediaTypes;
	schema_name: string;
	// TODO: See if this is still necessary once resolved in proxy
	type?: string;
	schema_thumbnail_url: string;
	schema_keywords: string[];
}
