import type { IPagination } from '@studiohyperdrive/pagination';

// Mapped intellectual entity object
export interface IeObject {
	schemaIdentifier: string; // Unique id per object
	meemooIdentifier: string; // PID (DON'T use this for identification of an object)
	premisIdentifier: Record<string, string[]>;
	premisIsPartOf?: string;
	series?: string[];
	program?: string[];
	alternativeName?: string[];
	partOfArchive: string[];
	partOfEpisode: string[];
	partOfSeason: string[];
	partOfSeries: string[];
	maintainerId: string;
	maintainerName: string;
	contactInfo: IeObjectContactInfo;
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
	publisher: Record<string, string[]>;
	spatial: string[];
	temporal: string[];
	keywords: string[];
	genre: string[];
	dctermsFormat: string;
	dctermsMedium: string;
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
	meemoofilmColor: boolean;
	meemoofilmBase: string;
	meemoofilmImageOrSound: string;
	meemooLocalId: string;
	meemooOriginalCp: string;
	meemooDescriptionProgramme: string;
	meemooDescriptionCast: string;
	representations: IeObjectRepresentation[];
}

export interface IeObjectContactInfo {
	email: string;
	telephone: string;
	address: IeObjectAddress;
}

export interface IeObjectAddress {
	street: string;
	postalCode: string;
	locality: string;
	postOfficeBoxNumber: string;
}

export interface IeObjectFile {
	id: string;
	name: string;
	alternateName: string;
	description: string;
	schemaIdentifier: string;
	ebucoreMediaType: string;
	ebucoreIsMediaFragmentOf: string;
	embedUrl: string;
}

export interface IeObjectRepresentation {
	name: string;
	alternateName: string;
	description: string;
	dctermsFormat: string;
	transcript: string;
	dateCreated: string;
	schemaIdentifier: string;
	files: IeObjectRepresentationFile[];
}

export interface IeObjectRepresentationFile {
	name: string;
	alternateName: string;
	description: string;
	ebucoreIsMediaFragmentOf: string;
	EbucoreMediaType: string;
	embedUrl: string;
	schemaIdentifier: string;
}

export interface IeObjectSearchAggregationPair<T> {
	key: T;
	doc_count: number;
}

export interface IeObjectSearchAggregation<T> {
	buckets: IeObjectSearchAggregationPair<T>[];
	doc_count_error_upper_bound: number;
	sum_other_doc_count: number;
}

// TODO: change Partial<IeObject> to IeObject with optional fields to prevent unknown values such as id and type
export type IeObjectSimilar = IPagination<Partial<IeObject>>;

export interface IeObjectSimilarShards {
	failed: number;
	skipped: number;
	successful: number;
	total: number;
}

export interface IeObjectSearchAggregations {
	dcterms_format: IeObjectSearchAggregation<string>;
	dcterms_medium: IeObjectSearchAggregation<string>;
	schema_genre: IeObjectSearchAggregation<string>;
	schema_creator: IeObjectSearchAggregation<string>;
	schema_in_language: IeObjectSearchAggregation<string>;
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
