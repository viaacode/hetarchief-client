import { QUERY_KEYS } from '@shared/const/query-keys';
import type { VisitRequest } from '@shared/types/visit-request';
import type { IPagination } from '@studiohyperdrive/pagination';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import type { GetAllActiveVisitsProps } from '@visit-requests/services/visit-request/visit-request.service.types';

export function useGetAllActiveVisits(
	props: GetAllActiveVisitsProps,
	enabled: boolean = true
): UseQueryResult<IPagination<VisitRequest>> {
	return useQuery({
		queryKey: [QUERY_KEYS.getVisitRequests, props],
		queryFn: () => VisitRequestService.getAllActiveVisits(props),
		enabled,
	});
}
