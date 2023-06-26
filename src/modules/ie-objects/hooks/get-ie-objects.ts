import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { isEmpty, isNil, noop } from 'lodash-es';
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
import { VISITOR_SPACE_LICENSES } from '@visitor-space/utils/elastic-filters';

import { IeObjectsService } from './../services';

export const useGetIeObjects = (
	args: {
		filters: IeObjectsSearchFilter[];
		page: number;
		size: number;
		sort?: SortObject;
		requestedAggs?: IeObjectsSearchFilterField[];
	},
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<GetIeObjectsResponse> => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	return useQuery(
		[QUERY_KEYS.getIeObjectsObjects, args, options],
		async () => {
			const { filters, page, size, sort, requestedAggs } = args;
			const filterQuery = !isNil(filters) && !isEmpty(filters) ? filters : [];

			const results = await IeObjectsService.getSearchResults(
				filterQuery,
				page,
				size,
				sort,
				requestedAggs
			);

			dispatch(setResults(results));
			dispatch(setFilterOptions(results.aggregations));

			// Log event
			const isVisitorSpaceSearch = !!filters.find(
				(filter) =>
					filter.field === IeObjectsSearchFilterField.LICENSES &&
					filter.multiValue === VISITOR_SPACE_LICENSES
			);
			if (!requestedAggs) {
				// Only trigger events for actual search requests, not for extra tab count requests
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
				).then(noop); // We don't want to wait for events calls
			}

			return results;
		},
		{
			keepPreviousData: true,
			enabled: options.enabled,
		}
	);
};
