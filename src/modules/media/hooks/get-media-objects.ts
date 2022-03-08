import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { MediaService } from '@media/services';
import { ReadingRoomMediaType } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper, ElasticsearchAggregations } from '@shared/types/api';

import { MediaFormat, MediaInfo } from '../types';

export function useGetMediaObjects(
	filters:
		| {
				query: string | undefined;
				format: ReadingRoomMediaType;
		  }
		| undefined,
	from: number,
	size: number
): UseQueryResult<ApiResponseWrapper<MediaInfo> & ElasticsearchAggregations> {
	return useQuery([QUERY_KEYS.getMediaObjects, { filters, from, size }], () => {
		const { format, ...rest } = filters || {};
		const mediaFormat: MediaFormat | undefined =
			format !== ReadingRoomMediaType.All ? format : undefined;

		// TODO: improve (?)
		// Run two queries to fetch aggregates across formats
		return Promise.all([
			MediaService.getAll({ ...rest, format: mediaFormat }, from, size),
			MediaService.getAll(rest, from, size),
		]).then((responses) => {
			const [results, noFormat] = responses;

			return {
				...results,
				aggregations: noFormat.aggregations,
			};
		});
	});
}
