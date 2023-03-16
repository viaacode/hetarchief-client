import { isEmpty } from 'lodash-es';
import { stringifyUrl } from 'query-string';

import { IeObject, IeObjectSimilar } from '@ie-objects/types';
import { ApiService } from '@shared/services/api-service';
import {
	IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	SortObject,
	VisitorSpaceMediaType,
} from '@shared/types';
import { GetIeObjectsResponse } from '@shared/types/api';
import { VisitorSpaceSort } from '@visitor-space/types';

import {
	IE_OBJECT_SERVICE_SEO_URL,
	IE_OBJECT_SERVICE_TICKET_URL,
	IE_OBJECTS_SERVICE_BASE_URL,
	IE_OBJECTS_SERVICE_EXPORT,
	IE_OBJECTS_SERVICE_RELATED_COUNT,
	IE_OBJECTS_SERVICE_SIMILAR,
	IO_OBJECTS_SERVICE_RELATED,
} from './ie-objects.service.const';

export class IeObjectsService {
	public static async getSearchResults(
		filters: IeObjectsSearchFilter[] = [],
		page = 1,
		size = 20,
		sort?: SortObject
	): Promise<GetIeObjectsResponse> {
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
					item.field === IeObjectsSearchFilterField.FORMAT &&
					item.operator === IeObjectsSearchOperator.IS &&
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
						IeObjectsSearchFilterField.FORMAT,
						IeObjectsSearchFilterField.GENRE,
						IeObjectsSearchFilterField.MEDIUM,
						IeObjectsSearchFilterField.CREATOR,
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER,
					],
					...parsedSort,
				}),
			})
			.json()) as GetIeObjectsResponse;

		return parsed;
	}

	public static async getById(id: string): Promise<IeObject> {
		return await ApiService.getApi().get(`${IE_OBJECTS_SERVICE_BASE_URL}/${id}`).json();
	}

	public static async getSeoById(id: string): Promise<{ name: string | null } | null> {
		return await ApiService.getApi()
			.get(`${IE_OBJECTS_SERVICE_BASE_URL}/${IE_OBJECT_SERVICE_SEO_URL}/${id}`)
			.json();
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

	public static async getSimilar(id: string): Promise<IeObjectSimilar> {
		return await ApiService.getApi()
			.get(`${IE_OBJECTS_SERVICE_BASE_URL}/${id}/${IE_OBJECTS_SERVICE_SIMILAR}`)
			.json();
	}

	public static async getRelated(
		id: string,
		maintainerId: string,
		meemooId: string
	): Promise<IeObjectSimilar> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${IE_OBJECTS_SERVICE_BASE_URL}/${id}/${IO_OBJECTS_SERVICE_RELATED}/${meemooId}`,
					query: {
						...(!isEmpty(maintainerId) && { maintainerId }),
					},
				})
			)
			.json();
	}

	public static async countRelated(
		meemooIdentifiers: string[] = []
	): Promise<Record<string, number>> {
		return await ApiService.getApi(true)
			.get(
				stringifyUrl(
					{
						url: `${IE_OBJECTS_SERVICE_BASE_URL}/${IE_OBJECTS_SERVICE_RELATED_COUNT}`,
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
			.get(`${IE_OBJECT_SERVICE_TICKET_URL}/${id}/${IE_OBJECTS_SERVICE_EXPORT}`)
			.then((r) => r.blob());
	}
}
