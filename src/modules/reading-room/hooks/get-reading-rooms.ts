import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { ReadingRoomService } from '@reading-room/services';
import { ReadingRoomInfo } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper } from '@shared/types/api';

export function useGetReadingRooms(
	searchInput: string | undefined,
	page: number,
	size: number
): UseQueryResult<ApiResponseWrapper<ReadingRoomInfo>> {
	return useQuery([QUERY_KEYS.getReadingRooms, { searchInput, page, size }], () =>
		ReadingRoomService.getAll(searchInput, page, size)
	);
}
