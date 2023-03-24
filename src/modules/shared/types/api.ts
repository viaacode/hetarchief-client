import type { IPagination } from '@studiohyperdrive/pagination';

import { IeObject, IeObjectSearchAggregations } from '@ie-objects/types';

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

export interface IeObjectsSearchterms {
	searchTerms: string[];
}

export type GetIeObjectsResponse = IPagination<IeObject & { related_count?: number }> &
	ElasticsearchAggregations &
	IeObjectsSearchterms;
