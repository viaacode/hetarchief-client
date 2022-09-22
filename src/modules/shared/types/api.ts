import { MediaSearchAggregations } from '@media/types';
import { MediaInfo } from '@shared/types/media';

export interface ElasticsearchResponse<T> extends ElasticsearchAggregations {
	took: number;
	timed_out: boolean;
	_shards: {
		total: number;
		successful: number;
		skipped: number;
		failed: number;
	};
	hits: {
		total: {
			value: number;
			relation: string;
		};
		max_score: number;
		hits: {
			_index: string;
			_type: string;
			_id: string;
			_score: number;
			_source: T;
		}[];
	};
}

export interface ElasticsearchAggregations {
	aggregations: MediaSearchAggregations;
}

export interface ApiResponseWrapper<T> {
	items: T[];
	total: number;
	pages: number;
	page: number;
	size: number;
}

export type GetMediaResponse = ApiResponseWrapper<MediaInfo & { related_count?: number }> &
	ElasticsearchAggregations;
