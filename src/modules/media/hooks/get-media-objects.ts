import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper, ElasticsearchAggregations } from '@shared/types/api';

import { MediaInfo } from '../types';

export function useGetMediaObjects(
	filters:
		| {
				query: string | undefined;
		  }
		| undefined,
	page: number,
	size: number
): UseQueryResult<ApiResponseWrapper<MediaInfo> & ElasticsearchAggregations> {
	return useQuery([QUERY_KEYS.getMediaObjects, { filters, page, size }], () =>
		MediaService.getAll(filters, page, size)
	);
}
