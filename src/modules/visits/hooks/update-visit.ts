import { useMutation, UseMutationResult } from 'react-query';

import { Visit } from '@shared/types';
import { VisitsService } from '@visits/services';
import { UpdateVisit } from '@visits/types';

export function useUpdateVisitRequest(): UseMutationResult<Visit, void, UpdateVisit> {
	return useMutation(({ id, updatedProps }) => VisitsService.patchById(id, updatedProps));
}
