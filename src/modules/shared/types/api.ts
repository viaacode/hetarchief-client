import { IeObject, IeObjectSearchAggregations } from 'modules/ie-objects/types';

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

export interface ApiResponseWrapper<T> {
	items: T[];
	total: number;
	pages: number;
	page: number;
	size: number;
}

export type GetIeObjectsResponse = ApiResponseWrapper<IeObject & { related_count?: number }> &
	ElasticsearchAggregations;
