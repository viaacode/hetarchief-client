import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import type { VisitRequest } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import type { CreateVisitRequest } from '@visitor-space/services/visitor-space/visitor-space.service.types';

export function useCreateVisitRequest(): UseMutationResult<
	VisitRequest,
	unknown,
	CreateVisitRequest
> {
	return useMutation((createVisitRequest: CreateVisitRequest) =>
		VisitRequestService.create(createVisitRequest)
	);
}
