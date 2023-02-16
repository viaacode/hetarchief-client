import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { setResults } from '@shared/store/media';
import {
	GetIeObjectsResponse,
	IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	SortObject,
} from '@shared/types';

import { IeObjectsService } from 'modules/ie-objects/services';

async function addRelatedCount(response: GetIeObjectsResponse): Promise<GetIeObjectsResponse> {
	const count = await IeObjectsService.countRelated(
		response.items.map((item) => item.meemooIdentifier)
	);

	return {
		...response,
		items: response.items.map((item) => ({
			...item,
			// Reduce by 1 to account for itself
			related_count: count[item.meemooIdentifier] - 1,
		})),
	};
}

export function useGetIeObjects(
	filters: IeObjectsSearchFilter[],
	page: number,
	size: number,
	sort?: SortObject,
	enabled = true
): UseQueryResult<GetIeObjectsResponse> {
	const dispatch = useDispatch();

	return useQuery(
		[QUERY_KEYS.getIeObjectsObjects, { filters, page, size, sort, enabled }],
		async () => {
			let searchResults: GetIeObjectsResponse;
			if (filters.length) {
				// Run 3 queries:
				//     - One to fetch the results for a specific tab (results),
				//     - One to count the amount of related items
				//     - and one to fetch the aggregates across tabs (noFormat)
				const responses = await Promise.all([
					IeObjectsService.getSearchResults(filters, page, size, sort).then(
						addRelatedCount
					),
					IeObjectsService.getSearchResults(
						filters.filter((item) => item.field !== IeObjectsSearchFilterField.FORMAT),
						page,
						0,
						sort
					),
				]);

				const [results, noFormat] = responses;
				searchResults = {
					...results,
					aggregations: {
						...noFormat.aggregations,
					},
				};
			} else {
				searchResults = await IeObjectsService.getSearchResults([], page, size, sort);
			}

			dispatch(setResults(searchResults));

			// Log event
			EventsService.triggerEvent(LogEventType.SEARCH, window.location.href, {
				filters,
				page,
				size,
				sort,
			});

			return searchResults;
		},
		{
			keepPreviousData: true,
			enabled,
		}
	);
}
