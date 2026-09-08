import type { IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';
import type { IPagination } from '@studiohyperdrive/pagination';
import type { HetArchiefIeObject } from '@viaa/avo2-types';

interface ElasticsearchAggregations {
	aggregations: IeObjectSearchAggregations | undefined;
}

export interface IeObjectsSearchTermObject {
	isLiteral: boolean;
	value: string;
}

interface IeObjectsSearchTerms {
	searchTerms: IeObjectsSearchTermObject[];
	// Not yet used, but could be used to show a toast message
	// about failed logical operator parsing in the search query string
	searchTermsParsedSuccessfully: boolean;
}

export type GetIeObjectsResponse = IPagination<HetArchiefIeObject & { related_count?: number }> &
	ElasticsearchAggregations &
	IeObjectsSearchTerms;
