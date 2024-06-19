import { type QueryClient, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { type User } from '@auth/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { type Visit } from '@shared/types';
import { VisitsService } from '@visit-requests/services';

export async function getActiveVisitForUserAndSpace(
	visitorSpaceSlug: string,
	user: User | null | undefined
): Promise<Visit | null> {
	if (!user) {
		return null; // Anonymous users can never have an active visit request
	}
	return VisitsService.getActiveVisitForUserAndSpace(visitorSpaceSlug);
}

export function useGetActiveVisitForUserAndSpace(
	visitorSpaceSlug: string,
	user: User | null | undefined,
	options: { enabled?: boolean } = {}
): UseQueryResult<Visit> {
	return useQuery(
		[QUERY_KEYS.getActiveVisitForUserAndSpace, visitorSpaceSlug, user?.id || null],
		() => getActiveVisitForUserAndSpace(visitorSpaceSlug, user || null),
		{ enabled: true, retry: 0, ...options }
	);
}

export async function makeServerSideRequestGetActiveVisitForUserAndSpace(
	queryClient: QueryClient,
	visitorSpaceSlug: string
): Promise<void> {
	queryClient.setQueryData(
		[QUERY_KEYS.getActiveVisitForUserAndSpace, visitorSpaceSlug, null],
		null
	);
}
