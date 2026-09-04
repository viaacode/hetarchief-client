import type { IPagination } from '@studiohyperdrive/pagination';
import type { HetArchiefIeObject } from '@viaa/avo2-types';
import type { ElasticsearchFieldNames } from '@visitor-space/types';

interface IeObjectSearchAggregationPair<T> {
	key: T;
	doc_count: number;
}

interface IeObjectSearchAggregation<T> {
	buckets: IeObjectSearchAggregationPair<T>[];
	doc_count_error_upper_bound: number;
	sum_other_doc_count: number;
}

// TODO: change Partial<IeObject> to IeObject with optional fields to prevent unknown values such as id and type
export type IeObjectSimilar = IPagination<Partial<HetArchiefIeObject>>;

type aggregateKeys =
	| ElasticsearchFieldNames.Format
	| ElasticsearchFieldNames.Medium
	| ElasticsearchFieldNames.ObjectType
	| ElasticsearchFieldNames.Genre
	| ElasticsearchFieldNames.Language
	| ElasticsearchFieldNames.Maintainer
	| ElasticsearchFieldNames.RightsForNewspaper
	| ElasticsearchFieldNames.RightsForAudioVideo;

export type IeObjectSearchAggregations = Record<aggregateKeys, IeObjectSearchAggregation<string>>;

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
	RequestMaterialForReuse = 'request-material-for-reuse',
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

export enum HighlightMode {
	MENTION_NAME = 'MENTION_NAME', // Highlight fallen soldier name
	OCR_SEARCH = 'OCR_SEARCH', // Highlight ocr search terms
	OCR_WORD = 'OCR_WORD', // Highlight ocr word that the user clicked
}
