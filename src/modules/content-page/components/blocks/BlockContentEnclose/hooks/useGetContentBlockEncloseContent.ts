import { AdminConfigManager, fetchWithLogoutJson } from '@meemoo/admin-core-ui/dist/client.mjs';
import { useQueries } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import { compact, kebabCase } from 'lodash-es';
import getConfig from 'next/config';
import { stringifyUrl } from 'query-string';
import { stripHtml } from 'string-strip-html';

import type { IeObject } from '@ie-objects/ie-objects.types';
import { QUERY_KEYS } from '@shared/const';
import { Locale } from '@shared/utils/i18n';

import type { MappedElement } from '../BlockContentEnclose.types';

import { IeObjectsService } from '@ie-objects/services';
import type {
	ContentPage,
	GetContentBlockEncloseContentReturnType,
} from './useGetContentBlockEncloseContent.types';

const { publicRuntimeConfig } = getConfig();

export const useGetContentBlockEncloseContent = (
	ids: MappedElement[],
	originalElements: { mediaItem: Avo.Core.PickerItem }[]
): GetContentBlockEncloseContentReturnType[] => {
	const ieObjectIds = ids.filter((id) => id.type === 'IE_OBJECT').map((id) => id.value);
	const contentPageIds = ids.filter((id) => id.type === 'CONTENT_PAGE').map((id) => id.value);

	// TODO PREF: see if we can use a custom endpoint to speed up the fetching of multiple objects for this block
	const ieObjectQuery = {
		queryKey: [QUERY_KEYS.GET_IE_OBJECT_FOR_CONTENT_ENCLOSE_BLOCK],
		queryFn: () => IeObjectsService.getBySchemaIdentifiers(ieObjectIds),
		keepPreviousData: true,
		enabled: ieObjectIds.length > 0,
	};

	const contentPageQueries = contentPageIds.map((id) => ({
		queryKey: [QUERY_KEYS.GET_CONTENT_PAGE_BY_PATH, id],
		queryFn: () => {
			if (!id) {
				return null;
			}
			return fetchWithLogoutJson<ContentPage[]>(
				stringifyUrl({
					url: `${publicRuntimeConfig.PROXY_URL}/admin/content-pages/by-language-and-path`,
					query: {
						language: AdminConfigManager.getConfig().locale || Locale.nl,
						path: id,
						onlyInfo: 'false',
					},
				})
			);
		},
	}));

	const results = useQueries({
		queries: [...(ieObjectIds.length > 0 ? [ieObjectQuery] : []), ...contentPageQueries],
	});

	const mappedResults: GetContentBlockEncloseContentReturnType[] = compact(results).flatMap(
		(result): GetContentBlockEncloseContentReturnType[] => {
			if (result.status === 'success') {
				if (!result.data) {
					return [];
				}
				if (Array.isArray(result.data)) {
					const ieObjects = result.data as IeObject[];
					return ieObjects.map((item: IeObject): GetContentBlockEncloseContentReturnType => {
						return {
							id: item.maintainerId,
							name: item.name,
							description: item.description,
							thumbnail: item.thumbnailUrl,
							dateCreated: item.dateCreated || undefined,
							datePublished: item.datePublished,
							maintainerName: item.maintainerName,
							maintainerSlug: item.maintainerSlug,
							objectType: item.dctermsFormat,
							identifier: item.schemaIdentifier,
							pid: item.schemaIdentifier,
							link: `/zoeken/${item.maintainerSlug}/${item.schemaIdentifier}/${kebabCase(item.name)}`,
							type: 'IE_OBJECT' as const,
						};
					});
				}

				const contentPage = result.data as ContentPage;
				return [
					{
						id: contentPage.id,
						name: contentPage.title,
						description: stripHtml(contentPage.description).result,
						dateCreated: contentPage.createdAt,
						datePublished: contentPage.publishedAt,
						objectType: null,
						thumbnail: contentPage.thumbnailPath,
						link: contentPage.path,
						type: 'CONTENT_PAGE' as const,
					},
				];
			}
			return [];
		}
	);

	return compact(
		originalElements.map((element) => {
			return mappedResults.find(
				(item: GetContentBlockEncloseContentReturnType) =>
					(item &&
						(item.identifier === element?.mediaItem?.value ||
							item.link === element?.mediaItem?.value)) ||
					null
			);
		})
	);
};
