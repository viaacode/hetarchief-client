import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash-es';
import { useDispatch, useSelector } from 'react-redux';

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

import { IeObjectsService } from './../services';

const addRelatedCount = async (response: GetIeObjectsResponse): Promise<GetIeObjectsResponse> => {
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
};

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
			const [results, noFormat] = await Promise.all([
				IeObjectsService.getSearchResults(filterQuery, page, size, sort).then(
					addRelatedCount
				),
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
					...noFormat.aggregations,
				},
			};

			dispatch(setResults(searchResults));
			dispatch(setFilterOptions(searchResults.aggregations));

			// Log event
			EventsService.triggerEvent(LogEventType.SEARCH, window.location.href, {
				filters,
				page,
				size,
				sort,
				user_group_name: user?.groupName,
			});

			return searchResults;
		},
		{
			keepPreviousData: true,
			enabled,
		}
	);
};
