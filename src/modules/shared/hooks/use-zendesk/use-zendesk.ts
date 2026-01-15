import { ZendeskService } from '@shared/services/zendesk-service';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { Requests } from 'node-zendesk';

export function useZendesk(): UseMutationResult<
	Requests.ResponseModel,
	unknown,
	Requests.CreateModel
> {
	return useMutation({
		mutationFn: (request: Requests.CreateModel) => ZendeskService.createTicket(request),
	});
}
