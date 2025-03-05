import { OrderDirection } from '@meemoo/react-components';
import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil, noop } from 'lodash-es';
import { useDispatch, useSelector } from 'react-redux';

import { GroupName } from '@account/const';
import { selectUser } from '@auth/store/user';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { setFilterOptions, setResults } from '@shared/store/ie-objects';
import type { SortObject } from '@shared/types';
import type { GetIeObjectsResponse } from '@shared/types/api';
import { IeObjectsSearchFilterField, SearchPageMediaType } from '@shared/types/ie-objects';
import { SEARCH_RESULTS_PAGE_SIZE } from '@visitor-space/const';
import { type FilterValue, Operator, SearchSortProp } from '@visitor-space/types';
import { VISITOR_SPACE_LICENSES } from '@visitor-space/utils/elastic-filters';

import { IeObjectsService } from './../services';

export async function getIeObjects(
	filters: FilterValue[],
	page: number,
	size: number,
	sort: SortObject | undefined
): Promise<GetIeObjectsResponse> {
	const filterQuery = !isNil(filters) && !isEmpty(filters) ? filters : [];

	return IeObjectsService.getSearchResults(filterQuery, page, size, sort);
}

export const useGetIeObjects = (
	args: {
		filters: FilterValue[];
		page: number;
		size: number;
		sort?: SortObject;
	},
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<GetIeObjectsResponse> => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	return useQuery(
		[QUERY_KEYS.getIeObjectsResults, args, options],
		async () => {
			const results = await getIeObjects(args.filters, args.page, args.size, args.sort);

			dispatch(setResults(results));
			dispatch(setFilterOptions(results.aggregations));

			// Log event
			const isVisitorSpaceSearch = !!args.filters.find(
				(filter) =>
					filter.field === IeObjectsSearchFilterField.LICENSES &&
					filter.multiValue === VISITOR_SPACE_LICENSES
			);

			// Only trigger events for actual search requests, not for extra tab count requests
			EventsService.triggerEvent(
				isVisitorSpaceSearch ? LogEventType.BEZOEK_SEARCH : LogEventType.SEARCH,
				window.location.href,
				{
					filters: args.filters,
					page: args.page,
					size: args.size,
					sort: args.sort,
					user_group_name: user?.groupName || GroupName.ANONYMOUS,
				}
			).then(noop); // We don't want to wait for events calls

			return results;
		},
		{
			keepPreviousData: true,
			enabled: options.enabled,
		}
	);
};

export async function makeServerSideRequestGetIeObjects(queryClient: QueryClient) {
	const args = {
		filters: [
			{
				field: IeObjectsSearchFilterField.FORMAT,
				operator: Operator.IS,
				multiValue: [SearchPageMediaType.All],
			},
		],
		page: 1,
		size: SEARCH_RESULTS_PAGE_SIZE,
		sort: {
			orderProp: SearchSortProp.Relevance,
			orderDirection: OrderDirection.desc,
		},
	};
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: [
				QUERY_KEYS.getIeObjectsResults,
				args,
				{
					enabled: false,
				},
			],
			queryFn: () => getIeObjects(args.filters, args.page, args.size, args.sort),
		}),
		queryClient.prefetchQuery({
			queryKey: [
				QUERY_KEYS.getIeObjectsResults,
				args,
				{
					enabled: true,
				},
			],
			queryFn: () => getIeObjects(args.filters, args.page, args.size, args.sort),
		}),
	]);
}
