import { QUERY_KEYS } from '@shared/const';
import type { VisitRequest } from '@shared/types/visit-request';
import { QueryClient, type UseMutationResult, useMutation } from '@tanstack/react-query';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import type { UpdateVisit } from '@visit-requests/types';

export function useUpdateVisitRequest(): UseMutationResult<VisitRequest, void, UpdateVisit> {
	return useMutation({
		mutationFn: ({ id, updatedProps }) => VisitRequestService.patchById(id, updatedProps),
		onSuccess: async () => {
			const queryClient = new QueryClient();
			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.getVisitRequests],
			});
		},
	});
}
