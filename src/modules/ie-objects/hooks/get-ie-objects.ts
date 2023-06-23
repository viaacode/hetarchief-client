import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash-es';
import { useDispatch, useSelector } from 'react-redux';

import { GroupName } from '@account/const';
import { selectUser } from '@auth/store/user';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { setFilterOptions, setResults } from '@shared/store/ie-objects';
import {
	GetIeObjectsResponse,
	IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	SortObject,
} from '@shared/types';
import { ElasticsearchFieldNames } from '@visitor-space/types';
import { VISITOR_SPACE_LICENSES } from '@visitor-space/utils/elastic-filters';

import { IeObjectsService } from './../services';

export const useGetIeObjects = (
	filters: IeObjectsSearchFilter[],
	page: number,
	size: number,
	sort?: SortObject,
	enabled = true
): UseQueryResult<GetIeObjectsResponse> => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	return useQuery(
		[QUERY_KEYS.getIeObjectsObjects, { filters, page, size, sort, enabled }],
		async () => {
			const filterQuery = !isNil(filters) && !isEmpty(filters) ? filters : [];

			// Run 2 queries:
			//     - One to fetch the results for a specific (all, audio, video) tab (search results),
			//     - and one to fetch the aggregates across tabs (all-, video-, audio counts)
			const [results, noFormatResults] = await Promise.all([
				IeObjectsService.getSearchResults(filterQuery, page, size, sort),
				IeObjectsService.getSearchResults(
					filterQuery.filter((item) => item.field !== IeObjectsSearchFilterField.FORMAT),
					page,
					0,
					sort
				),
			]);

			const searchResults: GetIeObjectsResponse = {
				...results,
				aggregations: {
					...results.aggregations,
					// We want to show the counts on the video and audio tabs even when the audio is the active tab
					//   * results => will be filtering on format === audio
					//   * noFormatResults => will be used to fetch the count for video and audio tab
					// All other aggregations still need to follow the strict filtering with format
					[ElasticsearchFieldNames.Format]:
						noFormatResults.aggregations[ElasticsearchFieldNames.Format],
				},
			};

			dispatch(setResults(searchResults));
			dispatch(setFilterOptions(searchResults.aggregations));

			// Log event
			const isVisitorSpaceSearch = !!filters.find(
				(filter) =>
					filter.field === IeObjectsSearchFilterField.LICENSES &&
					filter.multiValue === VISITOR_SPACE_LICENSES
			);
			EventsService.triggerEvent(
				isVisitorSpaceSearch ? LogEventType.BEZOEK_SEARCH : LogEventType.SEARCH,
				window.location.href,
				{
					filters,
					page,
					size,
					sort,
					user_group_name: user?.groupName || GroupName.ANONYMOUS,
				}
			);

			return searchResults;
		},
		{
			keepPreviousData: true,
			enabled,
		}
	);
};
