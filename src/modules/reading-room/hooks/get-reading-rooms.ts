import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { VistorSpaceService } from '@reading-room/services';
import { ReadingRoomOrderProps, VisitorSpaceInfo } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { OrderDirection } from '@shared/types';
import { ApiResponseWrapper } from '@shared/types/api';

export function useGetReadingRooms(
	searchInput: string | undefined,
	page: number,
	size: number,
	orderProp?: ReadingRoomOrderProps,
	orderDirection?: OrderDirection
): UseQueryResult<ApiResponseWrapper<VisitorSpaceInfo>> {
	return useQuery(
		[QUERY_KEYS.getReadingRooms, { searchInput, page, size, orderProp, orderDirection }],
		() => VistorSpaceService.getAll(searchInput, page, size, orderProp, orderDirection),
		{
			keepPreviousData: true,
		}
	);
}
