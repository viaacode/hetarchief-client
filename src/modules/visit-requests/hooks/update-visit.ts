import { QueryClient, useMutation, type UseMutationResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';
import type { VisitRequest } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import type { UpdateVisit } from '@visit-requests/types';

export function useUpdateVisitRequest(): UseMutationResult<VisitRequest, void, UpdateVisit> {
	return useMutation(({ id, updatedProps }) => VisitRequestService.patchById(id, updatedProps), {
		onSuccess: async () => {
			const queryClient = new QueryClient();
			await queryClient.invalidateQueries([QUERY_KEYS.getVisitRequests]);
		},
	});
}
