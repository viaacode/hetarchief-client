import { QUERY_KEYS } from '@shared/const/query-keys';
import type { VisitRequest } from '@shared/types/visit-request';
import type { IPagination } from '@studiohyperdrive/pagination';
import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import type { GetVisitRequestsProps } from '@visit-requests/services/visit-request/visit-request.service.types';

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
	} = {}
): UseQueryResult<IPagination<VisitRequest>> {
	return useQuery({
		queryKey: [QUERY_KEYS.getVisitRequests, props],
		queryFn: () => getVisitRequests(props),
		enabled: true,
		...options,
	});
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
