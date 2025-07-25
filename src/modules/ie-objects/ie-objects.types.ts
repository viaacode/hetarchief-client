import type { IPagination } from '@studiohyperdrive/pagination';

import type { IeObjectType } from '@shared/types/ie-objects';
import type { ElasticsearchFieldNames } from '@visitor-space/types';

// Mapped intellectual entity object

export enum IsPartOfKey {
	archive = 'archive',
	program = 'program',
	series = 'series',
	episode = 'episode',
	season = 'season',
	newspaper = 'newspaper',
}

export interface IsPartOfCollection {
	name: string;
	collectionType: IsPartOfKey;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	isPreceededBy?: any[];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	isSucceededBy?: any[];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	locationCreated?: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	startDate?: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	endDate?: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	publisher?: any;
}

export interface IeObject {
	dctermsAvailable: string;
	dctermsFormat: IeObjectType;
	dctermsMedium: string[];
	premisIdentifier: Record<string, string>[];
	abstract: string;
	// biome-ignore lint/suspicious/noExplicitAny: we don't know the exact format of this field, since each organisation can enter it differently
	creator: any;
	dateCreated: string | null;
	datePublished: string;
	description: string;
	duration: string;
	genre: string[];
	iri: string;
	schemaIdentifier: string; // Unique id per object
	inLanguage: string[];
	keywords: string[];
	licenses: IeObjectLicense[];
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	maintainerLogo: string | null;
	maintainerOverlay: boolean | null;
	maintainerIiifAgreement?: boolean | null;
	name: string;
	// biome-ignore lint/suspicious/noExplicitAny: we don't know the exact format of this field, since each organisation can enter it differently
	publisher: any;
	spatial: string[];
	temporal: string[];
	thumbnailUrl: string;
	sector?: IeObjectSector;
	accessThrough?: IeObjectAccessThrough[];
	ebucoreObjectType?: string | null;
	meemoofilmContainsEmbeddedCaption?: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: we don't know the exact format of this field, since each organisation can enter it differently
	contributor?: any;
	copyrightHolder?: string;
	premisIsPartOf?: string | null;
	isPartOf?: IsPartOfCollection[];
	numberOfPages?: number;
	pageNumber?: number;
	meemooDescriptionCast?: string;
	maintainerFormUrl?: string | null;
	maintainerDescription?: string;
	maintainerSiteUrl?: string;
	meemooLocalId?: string;
	meemooOriginalCp?: string;
	durationInSeconds?: number;
	copyrightNotice?: string;
	meemooMediaObjectId?: string;
	transcript?: string;
	abrahamInfo?: {
		id: string;
		uri: string;
	};
	synopsis: string;
	collectionName?: string;
	collectionId?: string;
	collectionSeasonNumber?: string;
	issueNumber?: string;
	fragmentId?: string;
	creditText?: string;
	preceededBy?: string[];
	succeededBy?: string[];
	width?: string;
	height?: string;
	bibframeProductionMethod?: string | null;
	bibframeEdition?: string | null;
	locationCreated?: string;
	startDate?: string;
	endDate?: string;
	carrierDate?: string;
	newspaperPublisher?: string;
	alternativeTitle?: string[];
	digitizationDate?: string;
	children?: number;
	pages?: IeObjectPage[];
	mentions?: Mention[];
}

export enum IeObjectAccessThrough {
	PUBLIC_INFO = 'PUBLIC_INFO',
	VISITOR_SPACE_FULL = 'VISITOR_SPACE_FULL',
	VISITOR_SPACE_FOLDERS = 'VISITOR_SPACE_FOLDERS',
	SECTOR = 'SECTOR',
}

export enum IeObjectLicense {
	// Object Licenses
	PUBLIEK_METADATA_LTD = 'VIAA-PUBLIEK-METADATA-LTD',
	PUBLIEK_METADATA_ALL = 'VIAA-PUBLIEK-METADATA-ALL',
	PUBLIEK_CONTENT = 'VIAA-PUBLIEK-CONTENT',
	BEZOEKERTOOL_METADATA_ALL = 'BEZOEKERTOOL-METADATA-ALL',
	BEZOEKERTOOL_CONTENT = 'BEZOEKERTOOL-CONTENT',
	INTRA_CP_METADATA_ALL = 'VIAA-INTRA_CP-METADATA-ALL',
	INTRA_CP_METADATA_LTD = 'VIAA-INTRA_CP-METADATA-LTD',
	INTRA_CP_CONTENT = 'VIAA-INTRA_CP-CONTENT',

	// Rights statuses
	PUBLIC_DOMAIN = 'Publiek-Domein',
	COPYRIGHT_UNDETERMINED = 'COPYRIGHT-UNDETERMINED',
}

export enum IeObjectSector {
	CULTURE = 'Cultuur',
	GOVERNMENT = 'Overheid',
	PUBLIC = 'Publieke Omroep',
	REGIONAL = 'Regionale Omroep',
	RURAL = 'Landelijke Private Omroep',
}

export interface IeObjectFile {
	id: string;
	name: string;
	mimeType: string;
	storedAt: string;
	thumbnailUrl: string;
	duration: string;
	edmIsNextInSequence: string;
	createdAt: string;
}

export interface IeObjectPage {
	pageNumber: number;
	representations: IeObjectRepresentation[];
}

export interface IeObjectRepresentation {
	id: string;
	schemaName: string;
	isMediaFragmentOf: string;
	schemaInLanguage: string;
	schemaStartTime: string;
	schemaEndTime: string;
	schemaTranscript: string;
	schemaTranscriptUrl: string | null;
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

export type RelatedIeObject = Pick<
	IeObject,
	| 'dctermsAvailable'
	| 'dctermsFormat'
	| 'dateCreated'
	| 'datePublished'
	| 'description'
	| 'duration'
	| 'schemaIdentifier'
	| 'licenses'
	| 'maintainerId'
	| 'maintainerName'
	| 'maintainerSlug'
	| 'name'
	| 'thumbnailUrl'
	| 'sector'
	| 'accessThrough'
	| 'transcript'
	| 'iri'
>;

export interface RelatedIeObjects {
	parent: Partial<RelatedIeObject> | null;
	children: Partial<RelatedIeObject>[];
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
}

// Metadata

export enum MetadataExportFormats {
	fullNewspaperZip = 'fullNewspaperZip',
	onePageNewspaperZip = 'onePageNewspaperZip',
	xml = 'xml',
	csv = 'csv',
}

export interface ButtonsSortOrder {
	id: MediaActions;
	isPrimary?: boolean;
}

export interface OcrSearchResult {
	pageIndex: number;
	searchTerm: string;
	searchTermCharacterOffset: number | null;
	searchTermIndexOnPage: number | null;
}

export interface Mention {
	pageNumber: number;
	pageIndex: number;
	iri: string;
	name: string;
	confidence: number;
	birthDate: number;
	birthPlace: string;
	deathDate: number;
	deathPlace: string;
	highlights: MentionHighlight[];
}

export interface MentionHighlight {
	x: number;
	y: number;
	width: number;
	height: number;
}

export enum HighlightMode {
	MENTION_NAME = 'MENTION_NAME', // Highlight fallen soldier name
	OCR_SEARCH = 'OCR_SEARCH', // Highlight ocr search terms
	OCR_WORD = 'OCR_WORD', // Highlight ocr word that the user clicked
}
