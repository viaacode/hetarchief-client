import { ApiService } from '@shared/services';
import {
	ApiResponseWrapper,
	ElasticsearchAggregations,
	ElasticsearchResponse,
} from '@shared/types/api';

import { MediaInfo, MediaSearchFilters } from '../../types';

import { MEDIA_SERVICE_BASE_URL } from './media.service.const';

export class MediaService extends ApiService {
	public static async getAll(
		filters: MediaSearchFilters = {},
		page = 0,
		size = 20
	): Promise<ApiResponseWrapper<MediaInfo> & ElasticsearchAggregations> {
		const parsed = (await ApiService.getApi()
			.post(MEDIA_SERVICE_BASE_URL, {
				body: JSON.stringify({
					filters,
					size,
					page,
				}),
			})
			.json()) as ElasticsearchResponse<MediaInfo>;
		return {
			items: parsed?.hits?.hits.map((item) => item._source),
			total: parsed?.hits?.total?.value,
			size: size,
			page: Math.floor(page / size),
			pages: Math.ceil((parsed?.hits?.total?.value || 0) / size),
			aggregations: parsed.aggregations,
		};
	}
}
