import type { IPagination } from '@studiohyperdrive/pagination';

import { type IeObjectType } from '@shared/types/ie-objects';
import { type ElasticsearchFieldNames } from '@visitor-space/types';

// Mapped intellectual entity object

export enum IsPartOfKey {
	alternatief = 'alternatief',
	archief = 'archief',
	deelarchief = 'deelarchief',
	deelreeks = 'deelreeks',
	programma = 'programma',
	reeks = 'reeks',
	seizoen = 'seizoen',
	serie = 'serie',
	stuk = 'stuk',
	episode = 'episode',
	aflevering = 'aflevering',
	bestanddeel = 'bestanddeel',
	registratie = 'registratie',
	serienummer = 'serienummer',
	seizoennummer = 'seizoennummer',
}

export interface IeObject {
	dctermsAvailable: string;
	dctermsFormat: IeObjectType;
	dctermsMedium: string;
	meemoofilmBase: string;
	meemoofilmColor: boolean;
	meemoofilmImageOrSound: string;
	premisIdentifier: any;
	abstract: string;
	creator: any;
	dateCreated: string;
	datePublished: string;
	description: string;
	duration: string;
	genre: string[];
	schemaIdentifier: string; // Unique id per object
	inLanguage: string[];
	keywords: string[];
	licenses: IeObjectLicense[];
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	maintainerLogo: string | null;
	maintainerOverlay: boolean | null;
	name: string;
	publisher: any;
	spatial: string;
	temporal: string;
	thumbnailUrl: string;
	// EXTRA
	sector?: IeObjectSector;
	accessThrough?: IeObjectAccessThrough[];
	// OPTIONAL
	ebucoreObjectType?: string | null;
	meemoofilmContainsEmbeddedCaption?: boolean;
	premisIsPartOf?: string;
	contributor?: any;
	copyrightHolder?: string;
	isPartOf?: Partial<Record<IsPartOfKey, string[]>>;
	numberOfPages?: number;
	meemooDescriptionCast?: string;
	pageRepresentations?: IeObjectRepresentation[][];
	maintainerFormUrl?: string | null;
	maintainerDescription?: string;
	maintainerSiteUrl?: string;
	// FROM DB
	meemoofilmCaption?: string;
	meemoofilmCaptionLanguage?: string;
	meemooDescriptionProgramme?: string;
	meemooLocalId?: string;
	meemooOriginalCp?: string;
	durationInSeconds?: number;
	copyrightNotice?: string;
	meemooMediaObjectId?: string;
	ebucoreIsMediaFragmentOf?: string;
	ebucoreHasMediaFragmentOf?: boolean;
	dateCreatedLowerBound?: string;
	actor?: string | null; // string or object => not yet known, since all entries in the db are null
	// Not yet available
	transcript?: string;
	caption?: string;
	categorie?: string[];
	languageSubtitles?: string;
	meemooDescriptionCategory?: string[];
	meemoofilmEmbeddedCaption?: string;
	meemoofilmEmbeddedCaptionLanguage?: string;
}

export enum IeObjectAccessThrough {
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
	PUBLIEK_CONTENT = 'VIAA-PUBLIEK-CONTENT', // 'Publiek-Domein', // TODO ARC-ARC-2211
	COPYRIGHT_UNDETERMINED = 'COPYRIGHT-UNDETERMINED',
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
	id: string;
	name: string;
	mimeType: string;
	storedAt: string;
	thumbnailUrl: string;
	duration: string;
	edmIsNextInSequence: string;
}

export interface IeObjectRepresentation {
	id: string;
	name: string;
	isMediaFragmentOf: string;
	languages: string;
	startTime: string;
	transcript: string;
	edmIsNextInSequence: string;
	updatedAt: string;
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
	[ElasticsearchFieldNames.Format]: IeObjectSearchAggregation<string>;
	[ElasticsearchFieldNames.Medium]: IeObjectSearchAggregation<string>;
	[ElasticsearchFieldNames.ObjectType]: IeObjectSearchAggregation<string>;
	[ElasticsearchFieldNames.Genre]: IeObjectSearchAggregation<string>;
	[ElasticsearchFieldNames.Language]: IeObjectSearchAggregation<string>;
	[ElasticsearchFieldNames.Maintainer]: IeObjectSearchAggregation<string>;
}

// UI

export enum ObjectDetailTabs {
	Media = 'media',
	Metadata = 'metadata',
	Ocr = 'ocr',
}

export enum MediaActions {
	Quotes = 'quotes',
	Description = 'description',
	Bookmark = 'bookmark',
	Contact = 'contact',
	Calendar = 'calendar',
	RelatedObjects = 'related-objects',
	RequestMaterial = 'request-material',
	Report = 'report',
	RequestAccess = 'request-access',
	Export = 'export',
	ToggleHighlightSearchTerm = 'toggle-highlight-search-term',
}

// Metadata

export enum MetadataExportFormats {
	fullNewspaperZip = 'fullNewspaperZip',
	onePageNewspaperZip = 'onePageNewspaperZip',
	xml = 'xml',
	csv = 'csv',
}

export interface MetadataSortMap {
	id: MediaActions;
	isPrimary?: boolean;
}

export interface AltoTextLine {
	text: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface OcrSearchResult {
	pageIndex: number;
	word: string;
	wordIndex: number;
}
