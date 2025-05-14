import type { IPagination } from '@studiohyperdrive/pagination';

import type { IeObject, IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';

export interface ElasticsearchResponse<T> extends ElasticsearchAggregations {
	items: {
		_index: string;
		_type: string;
		_id: string;
		_score: number;
		_source: T;
	}[];
	page: number;
	pages: number;
	size: number;
	total: number;
}

export interface ElasticsearchAggregations {
	aggregations: IeObjectSearchAggregations;
}

export interface IeObjectsSearchTerms {
	searchTerms: string[];
	// Not yet used, but could be used to show a toast message
	// about failed logical operator parsing in the search query string
	searchTermsParsedSuccessfully: boolean;
}

export type GetIeObjectsResponse = IPagination<IeObject & { related_count?: number }> &
	ElasticsearchAggregations &
	IeObjectsSearchTerms;
