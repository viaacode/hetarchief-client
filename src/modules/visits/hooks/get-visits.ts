import { useQuery } from 'react-query';
import { UseQueryResult } from 'react-query/types/react/types';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { OrderDirection, Visit, VisitStatus } from '@shared/types';
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
	enabled = true,
	personal = false,
}: {
	searchInput?: string | undefined;
	status?: VisitStatus | undefined;
	timeframe?: VisitTimeframe | undefined;
	page: number;
	size: number;
	orderProp?: keyof Visit;
	orderDirection?: OrderDirection;
	userProfileId?: string;
	enabled?: boolean;
	personal?: boolean;
}): UseQueryResult<ApiResponseWrapper<Visit>> {
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
				orderDirection,
				personal
			),
		{ keepPreviousData: true, enabled }
	);
}
