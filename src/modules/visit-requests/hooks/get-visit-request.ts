import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { type VisitRequest } from '@shared/types/visit-request';
import { VisitRequestService } from '@visit-requests/services/visit-request/visit-request.service';

export function useGetVisitRequest(): UseMutationResult<VisitRequest | null, unknown, string> {
	return useMutation((id: string) => VisitRequestService.getById(id));
}
