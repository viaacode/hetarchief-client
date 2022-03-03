import { ApiService } from '@shared/services';
import { ApiResponseWrapper, ElasticsearchResponse } from '@shared/types/api';

import { MediaInfo, MediaSearchFilters } from '../../types';

import { MEDIA_SERVICE_BASE_URL } from './media.service.const';

export class MediaService extends ApiService {
	public static async getAll(
		filters: MediaSearchFilters = {},
		from = 0,
		size = 20
	): Promise<ApiResponseWrapper<MediaInfo>> {
		const parsed = (await ApiService.getApi()
			.post(MEDIA_SERVICE_BASE_URL, {
				body: JSON.stringify({
					filters,
					size,
					from,
				}),
			})
			.json()) as ElasticsearchResponse<MediaInfo>;
		return {
			items: parsed?.hits?.hits.map((item) => item._source),
			total: parsed?.hits?.total?.value,
			size: size,
			page: Math.floor(from / size),
			pages: Math.ceil((parsed?.hits?.total?.value || 0) / size),
		};
	}

	public static async getById(id: string): Promise<MediaInfo> {
		return await ApiService.getApi().get(`${MEDIA_SERVICE_BASE_URL}/${id}`).json();
	}
}
