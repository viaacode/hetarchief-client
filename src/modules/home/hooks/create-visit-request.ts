import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { VisitsService } from '@modules/visit-requests/services';
import { Visit } from '@shared/types';
import { CreateVisitRequest } from '@visitor-space/services/visitor-space/visitor-space.service.types';

export function useCreateVisitRequest(): UseMutationResult<Visit, unknown, CreateVisitRequest> {
	return useMutation((createVisitRequest: CreateVisitRequest) =>
		VisitsService.create(createVisitRequest)
	);
}
