import { useMutation, UseMutationResult } from 'react-query';

import { VisitInfo } from '@shared/types';
import { VisitsService } from '@visits/services';
import { UpdateVisit } from '@visits/types';

export function useUpdateVisitRequest(): UseMutationResult<VisitInfo, void, UpdateVisit> {
	return useMutation(({ id, updatedProps }) => VisitsService.patchById(id, updatedProps));
}
