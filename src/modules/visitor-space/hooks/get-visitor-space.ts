import { QUERY_KEYS } from '@shared/const/query-keys';
import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';

import { VisitorSpaceService } from '../services';
import type { VisitorSpaceInfo } from '../types';

export function useGetVisitorSpace(
	maintainerSlug: string | null,
	ignoreAuthError = false,
	options: { enabled?: boolean } = {}
): UseQueryResult<VisitorSpaceInfo | null> {
	return useQuery({
		queryKey: [QUERY_KEYS.getVisitorSpaceInfo, maintainerSlug, ignoreAuthError],
		queryFn: async () => VisitorSpaceService.getBySlug(maintainerSlug, ignoreAuthError),
		enabled: true,
		retry: false,
		...options,
	});
}

export async function makeServerSideRequestGetVisitorSpace(
	queryClient: QueryClient,
	maintainerSlug: string | null,
	ignoreAuthError = false
) {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getVisitorSpaceInfo, maintainerSlug, ignoreAuthError],
		queryFn: () => VisitorSpaceService.getBySlug(maintainerSlug, ignoreAuthError),
	});
}
