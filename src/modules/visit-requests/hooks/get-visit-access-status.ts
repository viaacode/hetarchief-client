import { QUERY_KEYS } from '@shared/const';
import type { VisitAccessStatus } from '@shared/types/visit-request';
import {
	type UseMutationResult,
	type UseQueryResult,
	useMutation,
	useQuery,
} from '@tanstack/react-query';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';

// Query

export function useGetVisitAccessStatus(
	slug: string,
	enabled = true
): UseQueryResult<VisitAccessStatus | null> {
	return useQuery({
		queryKey: [QUERY_KEYS.getVisitAccessStatus, slug],
		queryFn: () => VisitRequestService.getAccessStatusBySpaceSlug(slug),
		enabled,
	});
}

// Mutation

export function useGetVisitAccessStatusMutation(): UseMutationResult<
	VisitAccessStatus | null,
	unknown,
	string
> {
	return useMutation({
		mutationFn: (slug: string) => VisitRequestService.getAccessStatusBySpaceSlug(slug),
	});
}
