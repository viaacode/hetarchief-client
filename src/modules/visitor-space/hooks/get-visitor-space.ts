import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';

import { VisitorSpaceService } from '../services';
import { VisitorSpaceInfo } from '../types';

export function useGetVisitorSpace(
	slug: string | null,
	ignoreAuthError = false,
	options: { enabled?: boolean } = {}
): UseQueryResult<VisitorSpaceInfo | null> {
	return useQuery(
		[QUERY_KEYS.getVisitorSpaceInfo, slug, ignoreAuthError],
		async () => {
			return await VisitorSpaceService.getBySlug(slug as string, ignoreAuthError);
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
