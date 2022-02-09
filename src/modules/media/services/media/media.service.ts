import { ApiService } from '@shared/services';
import { ApiResponseWrapper, ElasticsearchResponse } from '@shared/types/api';

import { MediaInfo, MediaSearchFilters } from '../../types';

import { MEDIA_SERVICE_BASE_URL } from './media.service.const';

class MediaService extends ApiService {
	public async getAll(
		filters: MediaSearchFilters = {},
		from = 0,
		size = 20
	): Promise<ApiResponseWrapper<MediaInfo>> {
		const parsed = (await this.api
			.post('', {
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
}

export const mediaService = new MediaService(MEDIA_SERVICE_BASE_URL);
