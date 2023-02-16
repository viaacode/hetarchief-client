import { stringifyUrl } from 'query-string';

import { Media, MediaSimilar } from '@media/types';
import { ApiService } from '@shared/services/api-service';
import {
	MediaSearchFilter,
	MediaSearchFilterField,
	MediaSearchOperator,
	SortObject,
	VisitorSpaceMediaType,
} from '@shared/types';
import { GetMediaResponse } from '@shared/types/api';
import { VisitorSpaceSort } from '@visitor-space/types';

import {
	IE_OBJECT_SERVICE_TICKET_URL,
	IE_OBJECTS_SERVICE_BASE_URL,
	MEDIA_SERVICE_BASE_URL,
	MEDIA_SERVICE_EXPORT,
	MEDIA_SERVICE_RELATED,
	MEDIA_SERVICE_SIMILAR,
} from './media.service.const';

export class MediaService {
	public static async getSearchResults(
		filters: MediaSearchFilter[] = [],
		page = 1,
		size = 20,
		sort?: SortObject
	): Promise<GetMediaResponse> {
		const parsedSort = !sort || sort.orderProp === VisitorSpaceSort.Relevance ? {} : sort;
		const filtered = [
			...filters.filter((item) => {
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
			}),
		];

		const parsed = (await ApiService.getApi(true)
			.post(`${IE_OBJECTS_SERVICE_BASE_URL}`, {
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
			.json()) as GetMediaResponse;

		return parsed;
	}

	public static async getById(id: string): Promise<Media> {
		return await ApiService.getApi().get(`${IE_OBJECTS_SERVICE_BASE_URL}/${id}`).json();
	}

	public static async getSeoById(id: string): Promise<{ name: string | null } | null> {
		return await ApiService.getApi().get(`${MEDIA_SERVICE_BASE_URL}/seo/${id}`).json();
	}

	public static async getPlayableUrl(referenceId: string | null): Promise<string | null> {
		if (!referenceId) {
			return null;
		}

		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${IE_OBJECTS_SERVICE_BASE_URL}/${IE_OBJECT_SERVICE_TICKET_URL}`,
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

	public static async countRelated(
		meemooIdentifiers: string[] = []
	): Promise<Record<string, number>> {
		return await ApiService.getApi(true)
			.get(
				stringifyUrl(
					{
						url: `${IE_OBJECTS_SERVICE_BASE_URL}/related/count`,
						query: { meemooIdentifiers },
					},
					{
						arrayFormat: 'comma',
					}
				)
			)
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
