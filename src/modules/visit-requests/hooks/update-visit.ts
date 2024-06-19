import { QueryClient, useMutation, type UseMutationResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';
import { type Visit } from '@shared/types';
import { VisitsService } from '@visit-requests/services';
import { type UpdateVisit } from '@visit-requests/types';

export function useUpdateVisitRequest(): UseMutationResult<Visit, void, UpdateVisit> {
	return useMutation(({ id, updatedProps }) => VisitsService.patchById(id, updatedProps), {
		onSuccess: async () => {
			const queryClient = new QueryClient();
			await queryClient.invalidateQueries([QUERY_KEYS.getVisits]);
		},
	});
}
