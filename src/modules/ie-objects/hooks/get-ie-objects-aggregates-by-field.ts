import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash-es';

import { AGGREGATE_BY_FIELD } from '@ie-objects/const';
import { IeObjectSearchAggregationPair } from '@ie-objects/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { GetIeObjectsResponse, IeObjectsSearchFilter } from '@shared/types';
import { VisitorSpaceFilterId } from '@visitor-space/types';

import { IeObjectsService } from '../services';

export const useGetIeObjectsAggregatesByField = (
	field: VisitorSpaceFilterId,
	filters: IeObjectsSearchFilter[],
	enabled = true
): UseQueryResult<IeObjectSearchAggregationPair<string>[]> => {
	const page = 0;
	const size = 0;
	const currentAgg = AGGREGATE_BY_FIELD[field];

	return useQuery(
		[QUERY_KEYS.getIeObjectsObjects, { filters, page, size, enabled }],
		async () => {
			const filterQuery = !isNil(filters) && !isEmpty(filters) ? filters : [];
			console.log(filterQuery);

			const searchResults: GetIeObjectsResponse = await IeObjectsService.getSearchResults(
				filterQuery,
				page,
				size
			);

			return !isNil(currentAgg) ? searchResults.aggregations?.[currentAgg]?.buckets : [];
		},
		{
			keepPreviousData: true,
			enabled,
		}
	);
};
