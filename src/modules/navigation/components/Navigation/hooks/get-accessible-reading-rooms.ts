import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { VisitorSpaceService } from '@reading-room/services';
import { VisitorSpaceInfo } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetAccessibleReadingRooms(): UseQueryResult<VisitorSpaceInfo[]> {
	return useQuery(
		QUERY_KEYS.getAccessibleReadingRooms,
		() => VisitorSpaceService.getAllAccessible(),
		{
			keepPreviousData: true,
		}
	);
}
