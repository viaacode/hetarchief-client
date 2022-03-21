import { ReadingRoomSort } from '@reading-room/types';
import { ApiService } from '@shared/services/api-service';
import { MediaInfo, SortObject } from '@shared/types';
import { ElasticsearchResponse, GetMedia } from '@shared/types/api';

import { MediaSearchFilters } from '../../types';

import { MEDIA_SERVICE_BASE_URL } from './media.service.const';

export class MediaService {
	public static async getAll(
		filters: MediaSearchFilters = {},
		page = 1,
		size = 20,
		sort?: SortObject
	): Promise<GetMedia> {
		const parsedSort = !sort || sort.orderProp === ReadingRoomSort.Relevance ? {} : sort;
		const parsed = (await ApiService.getApi()
			.post(MEDIA_SERVICE_BASE_URL, {
				body: JSON.stringify({
					filters,
					size,
					page,
					requestedAggs: ['format', 'genre'],
					...parsedSort,
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
