import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const';
import { ApiResponseWrapper } from '@shared/types';

import { MediaService } from '../services';
import { Media } from '../types';

export function useGetMediaRelated(
	id: string,
	esIndex: string,
	meemooId: string,
	enabled = true
): UseQueryResult<ApiResponseWrapper<Media>> {
	return useQuery(
		[QUERY_KEYS.getMediaRelated, { id }],
		() => MediaService.getRelated(id, esIndex, meemooId),
		{
			keepPreviousData: true,
			enabled,
		}
	);
}
