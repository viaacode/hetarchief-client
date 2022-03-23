import { useMutation, UseMutationResult } from 'react-query';

import { VisitInfo } from '@shared/types';
import { VisitsService } from '@visits/services';
import { PatchVisit } from '@visits/types';

export function useUpdateVisitRequest(): UseMutationResult<
	VisitInfo,
	void,
	{
		id: string;
		updatedProps: PatchVisit;
	}
> {
	return useMutation(({ id, updatedProps }) => VisitsService.patchById(id, updatedProps));
}
