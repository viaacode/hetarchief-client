import type { IPagination } from '@studiohyperdrive/pagination';

// Mapped intellectual entity object
export interface IeObject {
	schemaIdentifier: string; // Unique id per object
	meemooIdentifier: string; // PID (not unique per object)
	premisIdentifier: any;
	maintainerFormUrl: string | null;
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	datePublished: string;
	dctermsAvailable: string;
	name: string;
	description: string;
	abstract: string;
	creator: any;
	actor?: any;
	publisher: any;
	spatial: string;
	temporal: string;
	keywords: string[];
	genre: string[];
	dctermsFormat: string;
	dctermsMedium: string;
	inLanguage: string[];
	thumbnailUrl: string;
	duration: string;
	dateCreated: string;
	ebucoreObjectType: string;
	meemoofilmColor: boolean;
	meemoofilmBase: string;
	meemoofilmImageOrSound: string;
	meemooLocalId: string;
	meemooOriginalCp: string;
	meemooDescriptionProgramme: string;
	meemooDescriptionCast: string;
	licenses: IeObjectLicense[];
	series?: string[];
	accessThrough?: IeObjectAccessThrough[];
	program?: string[];
	alternativeName?: string[];
	premisIsPartOf?: string;
	contactInfo?: IeObjectContactInfo;
	copyrightHolder?: string;
	copyrightNotice?: string;
	durationInSeconds?: number;
	numberOfPages?: number;
	meemooMediaObjectId?: string;
	sector?: IeObjectSector;
	representations?: IeObjectRepresentation[];
	dateCreatedLowerBound?: string;
	ebucoreIsMediaFragmentOf?: string;
	meemoofilmCaption?: string;
	meemoofilmCaptionLanguage?: string;
	ebucoreHasMediaFragmentOf?: boolean;
	serviceProvider?: any; // type unknown
	transcript?: string;
	caption?: string;
	categorie?: any; // type unknown
}

export enum IeObjectAccessThrough {
	KEY_USER = 'KEY_USER',
	PUBLIC_INFO = 'PUBLIC_INFO',
	VISITOR_SPACE_FULL = 'VISITOR_SPACE_FULL',
	VISITOR_SPACE_FOLDERS = 'VISITOR_SPACE_FOLDERS',
	SECTOR = 'SECTOR',
}

export enum IeObjectLicense {
	PUBLIEK_METADATA_LTD = 'VIAA-PUBLIEK-METADATA-LTD',
	PUBLIEK_METADATA_ALL = 'VIAA-PUBLIEK-METADATA-ALL',
	BEZOEKERTOOL_METADATA_ALL = 'BEZOEKERTOOL-METADATA-ALL',
	BEZOEKERTOOL_CONTENT = 'BEZOEKERTOOL-CONTENT',
	INTRA_CP_METADATA_ALL = 'VIAA-INTRA_CP-METADATA-ALL',
	INTRA_CP_METADATA_LTD = 'VIAA-INTRA_CP-METADATA-LTD',
	INTRA_CP_CONTENT = 'VIAA-INTRA_CP-CONTENT',
}

export enum IeObjectSector {
	CULTURE = 'Cultuur',
	GOVERNMENT = 'Overheid',
	PUBLIC = 'Publieke Omroep',
	REGIONAL = 'Regionale Omroep',
	RURAL = 'Landelijke Private Omroep',
}

export interface IeObjectContactInfo {
	email?: string | null;
	telephone?: string | null;
	address: IeObjectAddress;
}

export interface IeObjectAddress {
	street: string;
	postalCode: string;
	locality: string;
	postOfficeBoxNumber: string;
}

export interface IeObjectFile {
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
	schemaIdentifier: string;
	dctermsFormat: string;
	transcript: string;
	dateCreated: string;
	files: IeObjectFile[];
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
	schema_maintainer: {
		schema_identifier: IeObjectSearchAggregation<string>;
	};
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
	RequestMaterial = 'request-material',
}
