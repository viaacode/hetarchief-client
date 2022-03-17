import { ApiService } from '@shared/services/api-service';
import {
	ApiResponseWrapper,
	ElasticsearchAggregations,
	ElasticsearchResponse,
} from '@shared/types/api';

import { MediaInfo, MediaSearchFilters } from '../../types';

import { MEDIA_SERVICE_BASE_URL } from './media.service.const';

export class MediaService {
	public static async getAll(
		filters: MediaSearchFilters = {},
		page = 1,
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
			page: page,
			pages: Math.ceil((parsed?.hits?.total?.value || 0) / size),
			aggregations: parsed.aggregations,
		};
	}

	public static async getById(id: string): Promise<MediaInfo> {
		return await ApiService.getApi().get(`${MEDIA_SERVICE_BASE_URL}/${id}`).json();
	}
}
