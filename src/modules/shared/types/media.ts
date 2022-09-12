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
	schema_maintainer?: {
		schema_identifier: string;
		schema_name: string;
	};
	dcterms_format: MediaTypes;
	schema_name: string;
	// TODO: See if this is still necessary once resolved in proxy
	type?: string;
	schema_thumbnail_url: string;
	schema_keywords: string[];
}
