import { MaterialRequestsService } from '@material-requests/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetMaterialRequestConversationUnreadCount(
	materialRequestId: string | undefined,
	enabled: boolean = true
): UseQueryResult<{ count: number }> {
	return useQuery({
		queryKey: [QUERY_KEYS.getMaterialRequestMessagesUnreadCount, materialRequestId],
		queryFn: (): Promise<{ count: number }> =>
			MaterialRequestsService.getUnreadMessages(materialRequestId as string),
		placeholderData: keepPreviousData,
		refetchOnMount: 'always',
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		enabled: enabled && !!materialRequestId,
		refetchInterval: 5_000, // every 5 seconds
	});
}
