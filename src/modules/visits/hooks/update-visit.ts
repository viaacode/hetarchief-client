import { QueryClient, useMutation, UseMutationResult } from 'react-query';

import { QUERY_KEYS } from '@shared/const';
import { Visit } from '@shared/types';
import { VisitsService } from '@visits/services';
import { UpdateVisit } from '@visits/types';

export function useUpdateVisitRequest(): UseMutationResult<Visit, void, UpdateVisit> {
	return useMutation(({ id, updatedProps }) => VisitsService.patchById(id, updatedProps), {
		onSuccess: async () => {
			const queryClient = new QueryClient();
			await queryClient.invalidateQueries(QUERY_KEYS.getVisits);
		},
	});
}
