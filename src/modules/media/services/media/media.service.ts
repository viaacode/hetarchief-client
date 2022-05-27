import { stringifyUrl } from 'query-string';

import { MediaSimilar } from '@media/types';
import { ApiService } from '@shared/services/api-service';
import {
	MediaInfo,
	MediaSearchFilter,
	MediaSearchFilterField,
	MediaSearchOperator,
	SortObject,
	VisitorSpaceMediaType,
} from '@shared/types';
import { ElasticsearchResponse, GetMediaResponse } from '@shared/types/api';
import { VisitorSpaceSort } from '@visitor-space/types';

import {
	MEDIA_SERVICE_BASE_URL,
	MEDIA_SERVICE_EXPORT,
	MEDIA_SERVICE_RELATED,
	MEDIA_SERVICE_SIMILAR,
	MEDIA_SERVICE_TICKET_URL,
} from './media.service.const';

export class MediaService {
	public static async getBySpace(
		orgId: string,
		filters: MediaSearchFilter[] = [],
		page = 1,
		size = 20,
		sort?: SortObject
	): Promise<GetMediaResponse> {
		const parsedSort = !sort || sort.orderProp === VisitorSpaceSort.Relevance ? {} : sort;
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
				item.value === VisitorSpaceMediaType.All;

			return hasValue && hasLength && !isFormatAllFilter;
		});

		const parsed = (await ApiService.getApi()
			.post(`${MEDIA_SERVICE_BASE_URL}/${orgId}`, {
				body: JSON.stringify({
					filters: filtered,
					size,
					page,
					requestedAggs: [
						MediaSearchFilterField.FORMAT,
						MediaSearchFilterField.GENRE,
						MediaSearchFilterField.CREATOR,
						MediaSearchFilterField.LANGUAGE,
						MediaSearchFilterField.MEDIUM,
					],
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
			.then((r) => r.blob());
	}
}
