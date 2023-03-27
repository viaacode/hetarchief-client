import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { Requests } from 'node-zendesk';

import { ZendeskService } from '@shared/services/zendesk-service';

export function useZendesk(): UseMutationResult<
	Requests.ResponseModel,
	unknown,
	Requests.CreateModel
> {
	return useMutation((request: Requests.CreateModel) => ZendeskService.createTicket(request));
}
