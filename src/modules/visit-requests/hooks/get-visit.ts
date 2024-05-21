import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { Visit } from '@shared/types';

import { VisitsService } from '@modules/visit-requests/services';

export function useGetVisit(): UseMutationResult<Visit | null, unknown, string> {
	return useMutation((id: string) => VisitsService.getById(id));
}
