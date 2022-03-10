import { ReadingRoomSort } from '@reading-room/types';
import { ApiService } from '@shared/services/api-service';
import { SortObject } from '@shared/types';
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
		size = 20,
		sort?: SortObject
	): Promise<ApiResponseWrapper<MediaInfo> & ElasticsearchAggregations> {
		const parsedSort = !sort || sort.orderProp === ReadingRoomSort.Relevance ? {} : sort;

		const parsed = (await ApiService.getApi()
			.post(MEDIA_SERVICE_BASE_URL, {
				body: JSON.stringify({
					filters,
					size,
					page,
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
}
