import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { setFilterOptions } from '@shared/store/ie-objects/ie-objects.slice';
import { GetIeObjectsResponse } from '@shared/types';

import { IeObjectsService } from './../services';

export const useGetFilterOptions = (
	options: { enabled: boolean } = { enabled: true }
): UseQueryResult<GetIeObjectsResponse> => {
	const dispatch = useDispatch();

	return useQuery(
		[QUERY_KEYS.getIeObjectsFilterOptions, options],
		async () => {
			const results = await IeObjectsService.getFilterOptions();

			dispatch(setFilterOptions(results));

			return results;
		},
		{
			keepPreviousData: true,
			enabled: options.enabled,
		}
	);
};
