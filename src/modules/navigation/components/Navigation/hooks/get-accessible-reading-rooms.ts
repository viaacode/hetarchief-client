import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { ReadingRoomService } from '@reading-room/services';
import { ReadingRoomInfo } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetAccessibleReadingRooms(): UseQueryResult<ReadingRoomInfo[]> {
	return useQuery(
		QUERY_KEYS.getAccessibleReadingRooms,
		() => ReadingRoomService.getAllAccessible(),
		{
			keepPreviousData: true,
		}
	);
}
