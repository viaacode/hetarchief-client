import { MaterialRequestsService } from '@material-requests/services';
import type { MaterialRequestMessage } from '@material-requests/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

interface SendMessageParams {
	message: string;
	files?: File[];
}

export function useSendMaterialRequestMessage(
	materialRequestId: string
): UseMutationResult<MaterialRequestMessage, unknown, SendMessageParams> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ message, files }: SendMessageParams) =>
			MaterialRequestsService.sendMessage(materialRequestId, message, files),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.getMaterialRequestMessages, materialRequestId],
			});
		},
	});
}
