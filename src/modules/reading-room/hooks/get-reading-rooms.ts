import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { readingRoomService } from '@reading-room/services';
import { ApiResponseWrapper, ReadingRoomInfo } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetReadingRooms(
	searchInput: string | undefined,
	page: number,
	size: number
): UseQueryResult<ApiResponseWrapper<ReadingRoomInfo>> {
	return useQuery([QUERY_KEYS.getReadingRooms, { searchInput, page, size }], () =>
		readingRoomService.getAll(searchInput, page, size)
	);
}
