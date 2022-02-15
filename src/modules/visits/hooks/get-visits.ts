import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { OrderDirection } from '@shared/types';
import { ApiResponseWrapper } from '@shared/types/api';
import { visitsService } from '@visits/services';
import { VisitInfo } from '@visits/types';

export function useGetVisits(
	searchInput: string | undefined,
	status: string | undefined,
	page: number,
	size: number,
	orderProp: keyof VisitInfo,
	orderDirection: OrderDirection
): UseQueryResult<ApiResponseWrapper<VisitInfo>> {
	return useQuery(
		[QUERY_KEYS.getVisits, { searchInput, status, page, size, orderProp, orderDirection }],
		() => visitsService.getAll(searchInput, status, page, size, orderProp, orderDirection)
	);
}
