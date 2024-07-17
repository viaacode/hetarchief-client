import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { type Visit } from '@shared/types/visit';
import { VisitsService } from '@visit-requests/services';

export function useGetVisit(): UseMutationResult<Visit | null, unknown, string> {
	return useMutation((id: string) => VisitsService.getById(id));
}
