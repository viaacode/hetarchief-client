import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { setFilterOptions } from '@shared/store/ie-objects';
import { GetIeObjectsResponse } from '@shared/types';

import { IeObjectsService } from './../services';
import { IeObjectSearchAggregations } from './../types';

export const useGetMediaFilterOptions = (): UseQueryResult<IeObjectSearchAggregations> => {
	const dispatch = useDispatch();

	return useQuery(
		[QUERY_KEYS.getIeObjectsFilterOptions],
		async () => {
			const response: GetIeObjectsResponse = await IeObjectsService.getSearchResults(
				[],
				0,
				0
			);
			dispatch(setFilterOptions(response.aggregations));

			return response.aggregations;
		},
		{
			keepPreviousData: true,
		}
	);
};
