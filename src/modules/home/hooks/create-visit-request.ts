import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { Visit } from '@shared/types';
import { CreateVisitRequest } from '@visitor-space/services/visitor-space/visitor-space.service.types';

import { VisitsService } from '@modules/visit-requests/services';

export function useCreateVisitRequest(): UseMutationResult<Visit, unknown, CreateVisitRequest> {
	return useMutation((createVisitRequest: CreateVisitRequest) =>
		VisitsService.create(createVisitRequest)
	);
}
