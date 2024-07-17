import {
	useMutation,
	type UseMutationResult,
	useQuery,
	type UseQueryResult,
} from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';
import { type VisitAccessStatus } from '@shared/types/visit';
import { VisitsService } from '@visit-requests/services';

// Query

export function useGetVisitAccessStatus(
	slug: string,
	enabled = true
): UseQueryResult<VisitAccessStatus | null> {
	return useQuery(
		[QUERY_KEYS.getVisitAccessStatus, slug],
		() => VisitsService.getAccessStatusBySpaceSlug(slug),
		{ enabled }
	);
}

// Mutation

export function useGetVisitAccessStatusMutation(): UseMutationResult<
	VisitAccessStatus | null,
	unknown,
	string
> {
	return useMutation((slug: string) => VisitsService.getAccessStatusBySpaceSlug(slug));
}
