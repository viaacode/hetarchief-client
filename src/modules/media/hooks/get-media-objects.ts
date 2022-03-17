import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';
import { useDispatch } from 'react-redux';

import { MediaService } from '@media/services';
import { ReadingRoomMediaType } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { setResults } from '@shared/store/media';
import { GetMedia, MediaTypes } from '@shared/types';

export function useGetMediaObjects(
	filters:
		| {
				query: string | undefined;
				format: ReadingRoomMediaType;
		  }
		| undefined,
	page: number,
	size: number
): UseQueryResult<GetMedia> {
	const dispatch = useDispatch();

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
				const output = {
					...results,
					aggregations: noFormat.aggregations,
				};

				dispatch(setResults(output));

				return output;
			});
		},
		{
			keepPreviousData: true,
		}
	);
}
