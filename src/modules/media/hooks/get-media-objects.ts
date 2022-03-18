import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { ReadingRoomMediaType } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { SortObject } from '@shared/types';
import { ApiResponseWrapper, ElasticsearchAggregations } from '@shared/types/api';

import { MediaInfo, MediaTypes } from '../types';

export function useGetMediaObjects(
	filters:
		| {
				query: string | undefined;
				format: ReadingRoomMediaType;
		  }
		| undefined,
	page: number,
	size: number,
	sort?: SortObject
): UseQueryResult<ApiResponseWrapper<MediaInfo> & ElasticsearchAggregations> {
	return useQuery(
		[QUERY_KEYS.getMediaObjects, { filters, page, size, sort }],
		() => {
			const { format, ...rest } = filters || {};
			const mediaFormat: MediaTypes | undefined =
				format !== ReadingRoomMediaType.All ? format : undefined;

			// TODO: improve (?)
			// Run two queries:
			//     - One to fetch the results for a specific tab (format)
			//     - and one to fetch the aggregates across formats
			return Promise.all([
				MediaService.getAll({ ...rest, format: mediaFormat }, page, size, sort),
				MediaService.getAll(rest, page, size, sort),
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
