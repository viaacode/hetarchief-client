import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper } from '@shared/types/api';

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
		MediaService.getAll(filters, from, size)
	);
}
