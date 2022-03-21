import { stringifyUrl } from 'query-string';

import { ReadingRoomSort } from '@reading-room/types';
import { ApiService } from '@shared/services/api-service';
import { MediaInfo, ReadingRoomMediaType, SortObject } from '@shared/types';
import { ElasticsearchResponse, GetMedia } from '@shared/types/api';

import { MediaSearchFilterField, MediaSearchFilters, MediaSearchOperator } from '../../types';

import { MEDIA_SERVICE_BASE_URL, MEDIA_SERVICE_TICKET_URL } from './media.service.const';

export class MediaService {
	public static async getAll(
		filters: MediaSearchFilters = [],
		page = 1,
		size = 20,
		sort?: SortObject
	): Promise<GetMedia> {
		const parsedSort = !sort || sort.orderProp === ReadingRoomSort.Relevance ? {} : sort;
		const filtered = filters.filter((item) => {
			// Don't send filters with no value
			const noValue = !item.value;

			// Don't send the "All" filter for FORMAT.IS
			const isFormatAllFilter =
				item.field === MediaSearchFilterField.FORMAT &&
				item.operator === MediaSearchOperator.IS &&
				item.value === ReadingRoomMediaType.All;

			return !noValue && !isFormatAllFilter;
		});

		const parsed = (await ApiService.getApi()
			.post(MEDIA_SERVICE_BASE_URL, {
				body: JSON.stringify({
					filters: filtered,
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

	public static async getPlayableUrl(referenceId: string | null): Promise<string | null> {
		if (!referenceId) {
			return null;
		}
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${MEDIA_SERVICE_BASE_URL}/${MEDIA_SERVICE_TICKET_URL}`,
					query: {
						id: referenceId,
					},
				})
			)
			.text();
	}
}
