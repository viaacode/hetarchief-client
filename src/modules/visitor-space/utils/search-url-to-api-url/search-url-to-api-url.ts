import type { IeObjectsSearchFilter } from '@shared/types/ie-objects';
import { parse as parseQueryString } from 'query-string';
import { decodeQueryParams } from 'use-query-params';

import { SEARCH_PAGE_QUERY_PARAM_CONFIG, type SearchPageQueryParams } from '../../const';
import { mapFiltersToElastic } from '../elastic-filters/elastic-filters';

export interface IeObjectsSearchBody {
	filters: IeObjectsSearchFilter[];
	size: number;
	page: number;
}

/**
 * Convert a raw hetarchief `/zoeken` search URL (as stored on the ObjectsGrid content-page block)
 * into the ie-objects search API request body, reusing the same filter mapping the search page
 * itself uses (`mapFiltersToElastic`). Passed into the admin-core through the admin-core config
 * (`services.search.searchUrlToApiUrl`) so the admin-core package doesn't need its own port of
 * this client-side filter logic.
 */
export const searchUrlToApiUrl = (searchQuery: string, size: number): IeObjectsSearchBody => {
	try {
		const url = new URL(searchQuery);
		const encodedQuery = parseQueryString(url.search);
		const query: SearchPageQueryParams = decodeQueryParams(
			SEARCH_PAGE_QUERY_PARAM_CONFIG,
			encodedQuery
		);

		return {
			filters: mapFiltersToElastic(query),
			size,
			page: query.page || 1,
		};
	} catch {
		// Invalid URL (already blocked by the editor validator) => return an empty search.
		return { filters: [], size, page: 1 };
	}
};
