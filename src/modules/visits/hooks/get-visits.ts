import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { OrderDirection, VisitInfo, VisitStatus } from '@shared/types';
import { ApiResponseWrapper } from '@shared/types/api';
import { VisitsService } from '@visits/services';
import { VisitTimeframe } from '@visits/types';

export function useGetVisits({
	searchInput,
	status,
	timeframe,
	page,
	size,
	orderProp,
	orderDirection,
}: {
	searchInput?: string | undefined;
	status?: VisitStatus | undefined;
	timeframe?: VisitTimeframe | undefined;
	page: number;
	size: number;
	orderProp?: keyof VisitInfo;
	orderDirection?: OrderDirection;
}): UseQueryResult<ApiResponseWrapper<VisitInfo>> {
	return useQuery(
		[
			QUERY_KEYS.getVisits,
			{ searchInput, status, timeframe, page, size, orderProp, orderDirection },
		],
		() =>
			VisitsService.getAll(
				searchInput,
				status,
				timeframe,
				page,
				size,
				orderProp,
				orderDirection
			),
		{ keepPreviousData: true }
	);
}
