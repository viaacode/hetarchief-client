import { useMutation, UseMutationResult } from 'react-query';

import { CreateVisitRequest } from '@reading-room/services/reading-room/reading-room.service.types';
import { VisitsService } from '@visits/services';
import { VisitInfo } from '@visits/types';

export function useCreateVisitRequest(): UseMutationResult<VisitInfo, unknown, CreateVisitRequest> {
	return useMutation((createVisitRequest: CreateVisitRequest) =>
		VisitsService.create(createVisitRequest)
	);
}
