import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { Requests } from 'node-zendesk';

import { ZendeskService } from '@shared/services/zendesk-service';

export function useZendesk(): UseMutationResult<
	Requests.ResponseModel,
	unknown,
	Requests.CreateModel
> {
	return useMutation((request: Requests.CreateModel) => ZendeskService.createTicket(request));
}
