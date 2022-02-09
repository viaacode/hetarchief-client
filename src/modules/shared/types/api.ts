export interface ElasticsearchResponse<T> {
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

export interface ApiResponseWrapper<T> {
	items: T[];
	total: number;
	pages: number;
	page: number;
	size: number;
}
