import { isEmpty } from 'lodash-es';
import { parseUrl, stringifyUrl } from 'query-string';

import type { IeObject, IeObjectSimilar, RelatedIeObjects } from '@ie-objects/ie-objects.types';
import type {
	IeObjectPreviousNextIds,
	SeoInfo,
} from '@ie-objects/services/ie-objects/ie-objects.service.types';
import type { SimplifiedAlto } from '@iiif-viewer/IiifViewer.types';
import { ApiService } from '@shared/services/api-service';
import type { SortObject } from '@shared/types';
import type { GetIeObjectsResponse } from '@shared/types/api';
import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	SearchPageMediaType,
} from '@shared/types/ie-objects';
import type { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { SearchSortProp } from '@visitor-space/types';

import {
	IE_OBJECT_SERVICE_SEO_URL,
	IE_OBJECT_SERVICE_TICKET_URL,
	IE_OBJECT_TICKET_SERVICE_URL,
	IE_OBJECTS_SERVICE_BASE_URL,
	IE_OBJECTS_SERVICE_SIMILAR,
	IO_OBJECTS_SERVICE_DOWNLOAD_ALTO_JSON,
	IO_OBJECTS_SERVICE_RELATED,
} from './ie-objects.service.const';

export namespace IeObjectsService {
	export async function getSearchResults(
		filters: IeObjectsSearchFilter[] = [],
		page = 1,
		size = 20,
		sort?: SortObject,
		requestedAggs?: IeObjectsSearchFilterField[]
	): Promise<GetIeObjectsResponse> {
		const parsedSort = !sort || sort.orderProp === SearchSortProp.Relevance ? {} : sort;
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
					item.value === SearchPageMediaType.All;

				return hasValue && hasLength && !isFormatAllFilter;
			}),
		];

		return (await ApiService.getApi(true)
			.post(`${IE_OBJECTS_SERVICE_BASE_URL}`, {
				body: JSON.stringify({
					filters: filtered,
					size,
					page,
					requestedAggs: requestedAggs || [
						IeObjectsSearchFilterField.FORMAT,
						IeObjectsSearchFilterField.GENRE,
						IeObjectsSearchFilterField.MEDIUM,
						IeObjectsSearchFilterField.OBJECT_TYPE,
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
					...parsedSort,
				}),
			})
			.json()) as GetIeObjectsResponse;
	}

	export async function getById(id: string): Promise<IeObject> {
		console.log(`[PERFORMANCE] ${new Date().toISOString()} start fetch ie object`);
		const ieObject: IeObject = await ApiService.getApi()
			.get(`${IE_OBJECTS_SERVICE_BASE_URL}/${id}`)
			.json();
		console.log(`[PERFORMANCE] ${new Date().toISOString()} finished fetch ie object`, id);
		return ieObject;
	}

	export async function getSeoById(id: string): Promise<SeoInfo> {
		return await ApiService.getApi()
			.get(`${IE_OBJECTS_SERVICE_BASE_URL}/${IE_OBJECT_SERVICE_SEO_URL}/${id}`)
			.json();
	}

	export async function getPlayableUrl(
		fileSchemaIdentifier: string | null
	): Promise<string | null> {
		if (!fileSchemaIdentifier) {
			return null;
		}

		const fileSchemaIdentifierWithoutTimeCodes = fileSchemaIdentifier.split('#')[0];

		const fullVideoPlayableUrl = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${IE_OBJECTS_SERVICE_BASE_URL}/${IE_OBJECT_SERVICE_TICKET_URL}`,
					query: {
						schemaIdentifier: fileSchemaIdentifierWithoutTimeCodes,
					},
				})
			)
			.text();

		// Add timecodes if the file.schemaIdentifier contains a #t=x,x suffix
		// eg: https://archief-media-qas.viaa.be/viaa/ERFGOEDCELKERF/b21722686aa34b239f77068d131c6155d72b5454df734b2690b42de537f753a0/browse.mp4#t=151,242
		// https://meemoo.atlassian.net/browse/ARC-1856
		const timeCodes = fileSchemaIdentifier.split('#')[1];
		const parsedUrl = parseUrl(fullVideoPlayableUrl);
		return stringifyUrl({
			url: parsedUrl.url + (timeCodes ? `#${timeCodes}` : ''),
			query: parsedUrl.query,
		});
	}

	export async function getTicketServiceToken(filePath: string): Promise<string | null> {
		const token = await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${IE_OBJECTS_SERVICE_BASE_URL}/${IE_OBJECT_TICKET_SERVICE_URL}`,
					query: {
						filePath: filePath.replace('https://iiif-qas.meemoo.be/', ''),
					},
				})
			)
			.text();

		return token || null;
	}

	// Used for "ook interessant" on the detail page
	export async function getSimilar(id: string, maintainerId: string): Promise<IeObjectSimilar> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${IE_OBJECTS_SERVICE_BASE_URL}/${id}/${IE_OBJECTS_SERVICE_SIMILAR}`,
					query: {
						...(!isEmpty(maintainerId) && { maintainerId }),
					},
				})
			)
			.json();
	}

	// Used for "gerelateerde objecten" blade on the detail page
	export async function getRelated(
		ieObjectIri: string,
		parentIeObjectIri: string | null
	): Promise<RelatedIeObjects> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${IE_OBJECTS_SERVICE_BASE_URL}/${IO_OBJECTS_SERVICE_RELATED}`,
					query: { ieObjectIri, parentIeObjectIri },
				})
			)
			.json();
	}

	export async function getAltoJsonFile(altoJsonUrl: string): Promise<SimplifiedAlto> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${IE_OBJECTS_SERVICE_BASE_URL}/${IO_OBJECTS_SERVICE_DOWNLOAD_ALTO_JSON}`,
					query: { altoJsonUrl },
				})
			)
			.json();
	}

	export async function schemaIdentifierLookup(
		schemaIdentifierV2: string
	): Promise<{ schemaIdentifierV3: string }> {
		return await ApiService.getApi()
			.get(`${IE_OBJECTS_SERVICE_BASE_URL}/schemaIdentifierLookup/${schemaIdentifierV2}`)
			.json();
	}

	export function getAutocompleteFieldOptions(
		field: AutocompleteField,
		query: string
	): Promise<string[]> {
		return ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${IE_OBJECTS_SERVICE_BASE_URL}/metadata/autocomplete`,
					query: {
						field,
						query,
					},
				})
			)
			.json();
	}

	export function getIeObjectPreviousNextIds(
		collectionId: string,
		ieObjectIri: string
	): Promise<IeObjectPreviousNextIds> {
		return ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${IE_OBJECTS_SERVICE_BASE_URL}/previous-next-ids`,
					query: {
						collectionId,
						ieObjectIri,
					},
				})
			)
			.json();
	}
}
