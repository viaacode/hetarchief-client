import { type UseMutationResult, useMutation } from '@tanstack/react-query';

import { MaterialRequestsService } from '../services';

interface EvaluateExtraConditionsParams {
	materialRequestId: string;
	action: 'accept' | 'decline';
}

export function useEvaluateExtraConditions(): UseMutationResult<
	void,
	unknown,
	EvaluateExtraConditionsParams
> {
	return useMutation({
		mutationFn: ({ materialRequestId, action }: EvaluateExtraConditionsParams) =>
			MaterialRequestsService.evaluateAdditionalConditions(materialRequestId, action),
	});
}
