import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';
import { useDispatch } from 'react-redux';

import { MediaService } from '@media/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { setResults } from '@shared/store/media';
import {
	GetMediaResponse,
	MediaSearchFilter,
	MediaSearchFilterField,
	SortObject,
} from '@shared/types';

export function useGetMediaObjects(
	orgId: string,
	filters: MediaSearchFilter[],
	page: number,
	size: number,
	sort?: SortObject,
	enabled = true
): UseQueryResult<GetMediaResponse> {
	const dispatch = useDispatch();

	return useQuery(
		[QUERY_KEYS.getMediaObjects, { slug: orgId, filters, page, size, sort, enabled }],
		async () => {
			let searchResults: GetMediaResponse;
			if (filters.length) {
				// Run 2 queries:
				//     - One to fetch the results for a specific tab (results),
				//     - and one to fetch the aggregates across tabs (noFormat)
				const responses = await Promise.all([
					MediaService.getBySpace(orgId, filters, page, size, sort),
					MediaService.getBySpace(
						orgId,
						filters.filter((item) => item.field !== MediaSearchFilterField.FORMAT),
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
				searchResults = await MediaService.getBySpace(orgId, [], page, size, sort);
			}

			dispatch(setResults(searchResults));

			// Log event
			EventsService.triggerEvent(LogEventType.SEARCH, window.location.href, {
				index: orgId,
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
