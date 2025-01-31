import { type QueryClient, useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { User } from '@auth/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import type { VisitRequest } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';

export async function getActiveVisitRequestForUserAndSpace(
	visitorSpaceSlug: string,
	user: User | null | undefined
): Promise<VisitRequest | null> {
	if (!user) {
		return null; // Anonymous users can never have an active visit request
	}
	return VisitRequestService.getActiveVisitForUserAndSpace(visitorSpaceSlug);
}

export function useGetActiveVisitRequestForUserAndSpace(
	visitorSpaceSlug: string,
	user: User | null | undefined,
	options: { enabled?: boolean } = {}
): UseQueryResult<VisitRequest> {
	return useQuery(
		[QUERY_KEYS.getActiveVisitForUserAndSpace, visitorSpaceSlug, user?.id || null],
		() => getActiveVisitRequestForUserAndSpace(visitorSpaceSlug, user || null),
		{ enabled: true, retry: 0, ...options }
	);
}

export async function makeServerSideRequestGetActiveVisitRequestForUserAndSpace(
	queryClient: QueryClient,
	visitorSpaceSlug: string
): Promise<void> {
	queryClient.setQueryData(
		[QUERY_KEYS.getActiveVisitForUserAndSpace, visitorSpaceSlug, null],
		null
	);
}
