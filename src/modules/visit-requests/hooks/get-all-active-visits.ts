import type { IPagination } from '@studiohyperdrive/pagination';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { type VisitRequest } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import { type GetAllActiveVisitsProps } from '@visit-requests/services/visit-request/visit-request.service.types';

export function useGetAllActiveVisits(
	props: GetAllActiveVisitsProps,
	options: {
		keepPreviousData: boolean;
		enabled: boolean;
	} = {
		keepPreviousData: true,
		enabled: true,
	}
): UseQueryResult<IPagination<VisitRequest>> {
	return useQuery(
		[QUERY_KEYS.getVisitRequests, props],
		() => VisitRequestService.getAllActiveVisits(props),
		options
	);
}
