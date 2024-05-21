import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';
import { VisitAccessStatus } from '@shared/types';
import { VisitsService } from '@visits/services';

// Query

export function useGetVisitAccessStatus(
	slug: string,
	enabled = true
): UseQueryResult<VisitAccessStatus | null> {
	return useQuery(
		[QUERY_KEYS.getVisitAccessStatus, { slug }],
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
