import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { ReadingRoomMediaType } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { MediaTypes } from '@shared/types';
import { ApiResponseWrapper, ElasticsearchAggregations } from '@shared/types/api';

import { MediaInfo } from '../types';

export function useGetMediaObjects(
	filters:
		| {
				query: string | undefined;
				format: ReadingRoomMediaType;
		  }
		| undefined,
	page: number,
	size: number
): UseQueryResult<ApiResponseWrapper<MediaInfo> & ElasticsearchAggregations> {
	return useQuery(
		[QUERY_KEYS.getMediaObjects, { filters, page, size }],
		() => {
			const { format, ...rest } = filters || {};
			const mediaFormat: MediaTypes | undefined =
				format !== ReadingRoomMediaType.All ? format : undefined;

			// TODO: improve (?)
			// Run two queries:
			//     - One to fetch the aggregates across formats
			//     - And one to fetch te results for a specific tab (format)
			return Promise.all([
				MediaService.getAll({ ...rest, format: mediaFormat }, page, size),
				MediaService.getAll(rest, page, size),
			]).then((responses) => {
				const [results, noFormat] = responses;

				return {
					...results,
					aggregations: noFormat.aggregations,
				};
			});
		},
		{
			keepPreviousData: true,
		}
	);
}
