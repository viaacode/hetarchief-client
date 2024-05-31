import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { Visit } from '@shared/types';
import { VisitsService } from '@visit-requests/services';
import { CreateVisitRequest } from '@visitor-space/services/visitor-space/visitor-space.service.types';

export function useCreateVisitRequest(): UseMutationResult<Visit, unknown, CreateVisitRequest> {
	return useMutation((createVisitRequest: CreateVisitRequest) =>
		VisitsService.create(createVisitRequest)
	);
}
