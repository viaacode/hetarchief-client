import { useMutation } from 'react-query';
import { UseMutationResult } from 'react-query/types/react/types';

import { Visit } from '@shared/types';
import { VisitsService } from '@visits/services';

export function useGetVisit(): UseMutationResult<Visit | null, unknown, string> {
	return useMutation((id: string) => VisitsService.getById(id));
}
