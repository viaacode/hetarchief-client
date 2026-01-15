import type { VisitRequest } from '@shared/types/visit-request';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';

export function useGetVisitRequest(): UseMutationResult<VisitRequest | null, unknown, string> {
	return useMutation({
		mutationFn: (id: string) => VisitRequestService.getById(id),
	});
}
