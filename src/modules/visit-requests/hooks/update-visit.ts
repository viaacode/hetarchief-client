import { QUERY_KEYS } from '@shared/const';
import type { VisitRequest } from '@shared/types/visit-request';
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import type { UpdateVisit } from '@visit-requests/types';

export function useUpdateVisitRequest(): UseMutationResult<VisitRequest, void, UpdateVisit> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, updatedProps }) => VisitRequestService.patchById(id, updatedProps),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.getVisitRequests],
			});
		},
	});
}
