import { i18n } from 'next-i18next';
import { stringifyUrl } from 'query-string';

import { MediaSimilar } from '@media/types';
import { ReadingRoomSort } from '@reading-room/types';
import { ApiService } from '@shared/services/api-service';
import { toastService } from '@shared/services/toast-service';
import {
	MediaInfo,
	MediaSearchFilterField,
	MediaSearchFilters,
	MediaSearchOperator,
	ReadingRoomMediaType,
	SortObject,
} from '@shared/types';
import { ElasticsearchResponse, GetMedia } from '@shared/types/api';

import {
	MEDIA_SERVICE_BASE_URL,
	MEDIA_SERVICE_EXPORT,
	MEDIA_SERVICE_RELATED,
	MEDIA_SERVICE_SIMILAR,
	MEDIA_SERVICE_TICKET_URL,
} from './media.service.const';

export class MediaService {
	public static async getBySpace(
		slug: string,
		filters: MediaSearchFilters = [],
		page = 1,
		size = 20,
		sort?: SortObject
	): Promise<GetMedia> {
		const parsedSort = !sort || sort.orderProp === ReadingRoomSort.Relevance ? {} : sort;
		const filtered = filters.filter((item) => {
			// Don't send filters with no value(s)
			const hasValue = !!item.value || !!item.multiValue;
			const eitherValue = item.multiValue || item.value;

			// Don't send filters with an empty array/string
			const hasLength = eitherValue && eitherValue.length > 0;

			// Don't send the "All" filter for FORMAT.IS
			const isFormatAllFilter =
				item.field === MediaSearchFilterField.FORMAT &&
				item.operator === MediaSearchOperator.IS &&
				item.value === ReadingRoomMediaType.All;

			return hasValue && hasLength && !isFormatAllFilter;
		});

		const parsed = (await ApiService.getApi()
			.post(`${MEDIA_SERVICE_BASE_URL}/${slug}`, {
				body: JSON.stringify({
					filters: filtered,
					size,
					page,
					requestedAggs: ['format', 'genre', 'creator', 'language'],
					...parsedSort,
				}),
			})
			.json()) as ElasticsearchResponse<MediaInfo>;

		return {
			items: parsed?.hits?.hits.map((item) => ({
				...item._source,
				meemoo_fragment_id: item._id,
			})),
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

	public static async getSimilar(id: string, esIndex: string): Promise<MediaSimilar> {
		return await ApiService.getApi()
			.get(`${MEDIA_SERVICE_BASE_URL}/${esIndex}/${id}/${MEDIA_SERVICE_SIMILAR}`)
			.json();
	}

	public static async getRelated(
		id: string,
		esIndex: string,
		meemooId: string
	): Promise<MediaSimilar> {
		return await ApiService.getApi()
			.get(`${MEDIA_SERVICE_BASE_URL}/${esIndex}/${id}/${MEDIA_SERVICE_RELATED}/${meemooId}`)
			.json();
	}

	public static async getExport(id?: string): Promise<Blob | null> {
		if (!id) {
			return null;
		}
		return await ApiService.getApi()
			.get(`${MEDIA_SERVICE_BASE_URL}/${id}/${MEDIA_SERVICE_EXPORT}`)
			.then((r) => r.blob())
			.catch((error) => {
				toastService.notify({
					title: i18n?.t('Er ging iets mis') || 'error',
					description: error,
				});
				return null;
			});
	}
}
