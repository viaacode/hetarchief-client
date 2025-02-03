import {
	useMutation,
	type UseMutationResult,
	useQuery,
	type UseQueryResult,
} from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';
import type { VisitAccessStatus } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';

// Query

export function useGetVisitAccessStatus(
	slug: string,
	enabled = true
): UseQueryResult<VisitAccessStatus | null> {
	return useQuery(
		[QUERY_KEYS.getVisitAccessStatus, slug],
		() => VisitRequestService.getAccessStatusBySpaceSlug(slug),
		{ enabled }
	);
}

// Mutation

export function useGetVisitAccessStatusMutation(): UseMutationResult<
	VisitAccessStatus | null,
	unknown,
	string
> {
	return useMutation((slug: string) => VisitRequestService.getAccessStatusBySpaceSlug(slug));
}
