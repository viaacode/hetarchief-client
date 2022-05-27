import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { VisitorSpaceService } from '@reading-room/services';
import { ReadingRoomOrderProps, VisitorSpaceInfo, VisitorSpaceStatus } from '@reading-room/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { OrderDirection } from '@shared/types';
import { ApiResponseWrapper } from '@shared/types/api';

export function useGetVisitorSpaces(
	searchInput: string | undefined,
	status: VisitorSpaceStatus[] | undefined,
	page: number,
	size: number,
	orderProp?: ReadingRoomOrderProps,
	orderDirection?: OrderDirection
): UseQueryResult<ApiResponseWrapper<VisitorSpaceInfo>> {
	return useQuery(
		[
			QUERY_KEYS.getVisitorSpaces,
			{ searchInput, status, page, size, orderProp, orderDirection },
		],
		() =>
			VisitorSpaceService.getAll(searchInput, status, page, size, orderProp, orderDirection),
		{
			keepPreviousData: true,
		}
	);
}
