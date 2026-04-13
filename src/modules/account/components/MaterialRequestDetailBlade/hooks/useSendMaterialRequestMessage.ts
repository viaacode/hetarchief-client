import { MaterialRequestsService } from '@material-requests/services';
import type { MaterialRequestMessage } from '@material-requests/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

export function useSendMaterialRequestMessage(
	materialRequestId: string
): UseMutationResult<MaterialRequestMessage, unknown, string> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (message: string) =>
			MaterialRequestsService.sendMessage(materialRequestId, message),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.getMaterialRequestMessages, materialRequestId],
			});
		},
	});
}
