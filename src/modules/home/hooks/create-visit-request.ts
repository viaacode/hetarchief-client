import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { type Visit } from '@shared/types/visit';
import { VisitsService } from '@visit-requests/services';
import { type CreateVisitRequest } from '@visitor-space/services/visitor-space/visitor-space.service.types';

export function useCreateVisitRequest(): UseMutationResult<Visit, unknown, CreateVisitRequest> {
	return useMutation((createVisitRequest: CreateVisitRequest) =>
		VisitsService.create(createVisitRequest)
	);
}
