import { useMutation, UseMutationResult } from 'react-query';

import { CreateVisitRequest } from '@reading-room/services/reading-room/reading-room.service.types';
import { Visit } from '@shared/types';
import { VisitsService } from '@visits/services';

export function useCreateVisitRequest(): UseMutationResult<Visit, unknown, CreateVisitRequest> {
	return useMutation((createVisitRequest: CreateVisitRequest) =>
		VisitsService.create(createVisitRequest)
	);
}
