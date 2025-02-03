import { type QueryClient, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { VisitorSpaceService } from '../services';
import type { VisitorSpaceInfo } from '../types';

export function useGetVisitorSpace(
	maintainerSlug: string | null,
	ignoreAuthError = false,
	options: { enabled?: boolean } = {}
): UseQueryResult<VisitorSpaceInfo | null> {
	return useQuery(
		[QUERY_KEYS.getVisitorSpaceInfo, maintainerSlug, ignoreAuthError],
		async () => {
			return VisitorSpaceService.getBySlug(maintainerSlug, ignoreAuthError);
		},
		{ enabled: true, retry: false, ...options }
	);
}

export async function makeServerSideRequestGetVisitorSpace(
	queryClient: QueryClient,
	maintainerSlug: string | null,
	ignoreAuthError = false
) {
	await queryClient.prefetchQuery(
		[QUERY_KEYS.getVisitorSpaceInfo, maintainerSlug, ignoreAuthError],
		() => VisitorSpaceService.getBySlug(maintainerSlug, ignoreAuthError)
	);
}
