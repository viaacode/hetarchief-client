import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { isNil } from 'lodash';
import { useDispatch } from 'react-redux';

import { MediaService } from '@media/services';
import { MediaSearchAggregations } from '@media/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { setFilterOptions } from '@shared/store/media';
import { GetMediaResponse } from '@shared/types';

export function useGetMediaFilterOptions(
	orgId: string | undefined
): UseQueryResult<MediaSearchAggregations> {
	const dispatch = useDispatch();

	return useQuery(
		[QUERY_KEYS.getMediaFilterOptions, { slug: orgId }],
		async () => {
			if (isNil(orgId)) {
				return;
			}

			const response: GetMediaResponse = await MediaService.getSearchResults(orgId, [], 0, 0);
			dispatch(setFilterOptions(response.aggregations));

			return response.aggregations;
		},
		{
			keepPreviousData: true,
		}
	);
}
