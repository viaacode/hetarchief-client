import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { ApiResponseWrapper } from '@shared/types/api';
import { visitsService } from '@visits/services';
import { VisitInfo } from '@visits/types';

export function useGetVisits(
	searchInput: string | undefined,
	status: string | undefined,
	page: number,
	size: number
): UseQueryResult<ApiResponseWrapper<VisitInfo>> {
	return useQuery([QUERY_KEYS.getVisits, { searchInput, status, page, size }], () =>
		visitsService.getAll(searchInput, status, page, size)
	);
}
