import { QueryClient, useMutation, UseMutationResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';
import { Visit } from '@shared/types';

import { VisitsService } from '@modules/visit-requests/services';
import { UpdateVisit } from '@modules/visit-requests/types';

export function useUpdateVisitRequest(): UseMutationResult<Visit, void, UpdateVisit> {
	return useMutation(({ id, updatedProps }) => VisitsService.patchById(id, updatedProps), {
		onSuccess: async () => {
			const queryClient = new QueryClient();
			await queryClient.invalidateQueries([QUERY_KEYS.getVisits]);
		},
	});
}
