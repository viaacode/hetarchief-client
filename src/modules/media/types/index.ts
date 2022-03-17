import { MediaTypes } from '@shared/types';

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
	representations: MediaRepresentation[];
}

export class MediaSearchFilters {
	query?: string;
	format?: MediaTypes;
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
	dcterms_format: MediaSearchAggregation<MediaTypes>;
	schema_genre?: MediaSearchAggregation<string>;
}

export enum ObjectDetailTabs {
	Media = 'media',
	Metadata = 'metadata',
}
