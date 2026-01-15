import type { VisitRequest } from '@shared/types/visit-request';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';
import type { CreateVisitRequest } from '@visitor-space/services/visitor-space/visitor-space.service.types';

export function useCreateVisitRequest(): UseMutationResult<
	VisitRequest,
	unknown,
	CreateVisitRequest
> {
	return useMutation({
		mutationFn: (createVisitRequest: CreateVisitRequest) =>
			VisitRequestService.create(createVisitRequest),
	});
}
