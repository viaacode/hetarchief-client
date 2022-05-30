import { useMutation, UseMutationResult } from 'react-query';

import { Visit } from '@shared/types';
import { CreateVisitRequest } from '@visitor-space/services/visitor-space/visitor-space.service.types';
import { VisitsService } from '@visits/services';

export function useCreateVisitRequest(): UseMutationResult<Visit, unknown, CreateVisitRequest> {
	return useMutation((createVisitRequest: CreateVisitRequest) =>
		VisitsService.create(createVisitRequest)
	);
}
