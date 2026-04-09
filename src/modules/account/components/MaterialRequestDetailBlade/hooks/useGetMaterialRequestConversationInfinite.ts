import type { MaterialRequestMessage } from '@account/components/MaterialRequestDetailBlade/MaterialRequestConversation.types';
import { MaterialRequestsService } from '@material-requests/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import type { IPagination } from '@studiohyperdrive/pagination';
import {
	type InfiniteData,
	keepPreviousData,
	type UseInfiniteQueryResult,
	useInfiniteQuery,
} from '@tanstack/react-query';

export function useGetMaterialRequestConversationInfinite(
	materialRequestId: string,
	size: number,
	enabled: boolean = true
): UseInfiniteQueryResult<InfiniteData<IPagination<MaterialRequestMessage>>> {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.getMaterialRequestMessages, materialRequestId, size],
		queryFn: ({ pageParam }): Promise<IPagination<MaterialRequestMessage>> =>
			MaterialRequestsService.getMaterialRequestMessages(
				materialRequestId,
				pageParam as number,
				size
			),
		getNextPageParam: (lastPage: IPagination<MaterialRequestMessage>) =>
			lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
		initialPageParam: 1,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60, // 1 minute
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		enabled,
	});
}
