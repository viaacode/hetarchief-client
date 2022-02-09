import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper, ElasticsearchResponse } from '@shared/types/api';

import { mediaService } from '../services/media';
import { MediaInfo } from '../types';

export function useGetMediaObjects(
	filters:
		| {
				query: string | undefined;
		  }
		| undefined,
	from: number,
	size: number
): UseQueryResult<ApiResponseWrapper<MediaInfo>> {
	return useQuery([QUERY_KEYS.getMediaObjects, { filters, from, size }], () =>
		mediaService.getAll(filters, from, size)
	);
}
