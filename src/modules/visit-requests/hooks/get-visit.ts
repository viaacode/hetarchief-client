import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { VisitsService } from '@modules/visit-requests/services';
import { Visit } from '@shared/types';

export function useGetVisit(): UseMutationResult<Visit | null, unknown, string> {
	return useMutation((id: string) => VisitsService.getById(id));
}
