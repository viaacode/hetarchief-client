import type { IPagination } from '@studiohyperdrive/pagination';
import { type QueryClient, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { type VisitRequest } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import { type GetVisitRequestsProps } from '@visit-requests/services/visit-request/visit-request.service.types';

export async function getVisitRequests(
	props: GetVisitRequestsProps
): Promise<IPagination<VisitRequest>> {
	return VisitRequestService.getAll(props);
}

export function useGetVisitRequests(
	props: GetVisitRequestsProps,
	options: {
		keepPreviousData?: boolean;
		enabled?: boolean;
	} = { keepPreviousData: true }
): UseQueryResult<IPagination<VisitRequest>> {
	return useQuery([QUERY_KEYS.getVisitRequests, props], () => getVisitRequests(props), options);
}

export function makeServerSideRequestGetVisitRequests(
	queryClient: QueryClient,
	props: GetVisitRequestsProps
): Promise<void> {
	return queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getVisitRequests, props],
		// Server is not logged in, so they can never have any visit requests
		queryFn: () => [],
	});
}
