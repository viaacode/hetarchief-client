export type MediaTypes = 'video' | 'audio' | null;

export interface MediaInfo {
	schema_in_language: unknown | null;
	dcterms_available: string;
	schema_creator?: {
		Archiefvormer?: string[];
		productionCompany?: string[];
		Maker?: string[];
	};
	schema_identifier: string;
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

// Mapped intelectual entity object
export interface Media {
	id: string;
	premisIdentifier: any;
	premisRelationship: string;
	isPartOf: string;
	partOfArchive: string[];
	partOfEpisode: string[];
	partOfSeason: string[];
	partOfSeries: string[];
	maintainerId: string;
	contactInfo: ContactInfo;
	copyrightHolder: string;
	copyrightNotice: string;
	durationInSeconds: number;
	numberOfPages: number;
	datePublished: string;
	dctermsAvailable: string;
	name: string;
	description: string;
	abstract: string;
	creator: any;
	actor: any;
	contributor: any;
	publisher: any;
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
	license: any;
	meemooFragmentId: string;
	meemooMediaObjectId: string;
	dateCreated: string;
	dateCreatedLowerBound: string;
	ebucoreObjectType: string;
	representations: Representation[];
}

export interface ContactInfo {
	email: string;
	telephone: string;
	address: Address;
}

export interface Address {
	street: string;
	postalCode: string;
	locality: string;
	postOfficeBoxNumber: string;
}

export interface Representation {
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

export class MediaSearchFilters {
	query?: string;
	format?: MediaTypes;
}

export interface MediaSearchAggregationPair {
	key: MediaTypes;
	doc_count: number;
}

export interface MediaSearchAggregations {
	dcterms_format: {
		buckets: MediaSearchAggregationPair[];
		doc_count_error_upper_bound: number;
		sum_other_doc_count: number;
	};
}

export enum ObjectDetailTabs {
	Media = 'media',
	Metadata = 'metadata',
}
