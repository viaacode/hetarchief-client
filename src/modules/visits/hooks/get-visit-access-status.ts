import { useMutation } from 'react-query';
import { UseMutationResult } from 'react-query/types/react/types';

import { VisitAccessStatus } from '@shared/types';
import { VisitsService } from '@visits/services';

export function useGetVisitAccessStatus(): UseMutationResult<
	VisitAccessStatus | null,
	unknown,
	string
> {
	return useMutation((id: string) => VisitsService.getAccessStatusBySpaceId(id));
}
