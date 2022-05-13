import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';
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
			if (!orgId) {
				return;
			}
			const response: GetMediaResponse = await MediaService.getBySpace(orgId, [], 0, 0);
			dispatch(setFilterOptions(response.aggregations));

			return response.aggregations;
		},
		{
			keepPreviousData: true,
		}
	);
}
