import { MediaTypes } from '@shared/types';

// Output

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
	schema_maintainer: {
		schema_identifier: string;
	}[];
	dcterms_format: MediaTypes;
	schema_name: string;
	// TODO: See if this is still necessary once resolved in proxy
	type?: string;
}

// Mapped intellectual entity object
export interface Media {
	meemooFragmentId: string; // Unique id per object
	schemaIdentifier: string; // PID (DON'T use this for identification of an object)
	premisIdentifier: Record<string, string[]>;
	premisRelationship: string;
	isPartOf: any;
	partOfArchive: string[];
	partOfEpisode: string[];
	partOfSeason: string[];
	partOfSeries: string[];
	maintainerId: string;
	maintainerName: string;
	contactInfo: MediaContactInfo;
	copyrightHolder: string;
	copyrightNotice: string;
	durationInSeconds: number;
	numberOfPages: number;
	datePublished: string;
	dctermsAvailable: string;
	name: string;
	description: string;
	abstract: string;
	creator: Record<string, string[]>;
	actor: Record<string, string[]>;
	contributor: Record<string, string[]>;
	publisher: Record<string, string[]>;
	spatial: string[];
	temporal: string[];
	keywords: string[];
	genre: string[];
	dctermsFormat: string;
	inLanguage: string[];
	thumbnailUrl: string;
	embedUrl: string;
	alternateName: string;
	duration: string;
	license: string[];
	meemooMediaObjectId: string;
	dateCreated: string;
	dateCreatedLowerBound: string;
	ebucoreObjectType: string;
	representations: MediaRepresentation[];
}

export interface MediaContactInfo {
	email: string;
	telephone: string;
	address: MediaAddress;
}

export interface MediaAddress {
	street: string;
	postalCode: string;
	locality: string;
	postOfficeBoxNumber: string;
}

export interface MediaRepresentation {
	name: string;
	alternateName: string;
	description: string;
	meemooFragmentId: string;
	dctermsFormat: string;
	transcript: string;
	dateCreated: string;
	id: string;
	files: File[];
}

export interface MediaSearchAggregationPair<T> {
	key: T;
	doc_count: number;
}

export interface MediaSearchAggregation<T> {
	buckets: MediaSearchAggregationPair<T>[];
	doc_count_error_upper_bound: number;
	sum_other_doc_count: number;
}

export interface MediaSearchAggregations {
	dcterms_format: MediaSearchAggregation<string>;
	schema_genre: MediaSearchAggregation<string>;
	schema_creator: MediaSearchAggregation<string>;
	schema_in_language: MediaSearchAggregation<string>;
}

// UI

export enum ObjectDetailTabs {
	Media = 'media',
	Metadata = 'metadata',
}

export enum MediaActions {
	Quotes = 'quotes',
	Description = 'description',
	Bookmark = 'bookmark',
	Contact = 'contact',
	Calendar = 'calendar',
	RelatedObjects = 'related-objects',
}
