import { getLastEvent } from '@account/utils/get-last-material-request-event';
import { MaterialRequestsService } from '@material-requests/services';
import { MaterialRequestEventType, type MaterialRequestStatuses } from '@material-requests/types';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type Query, type UseQueryResult, useQuery } from '@tanstack/react-query';

export function useGetMaterialRequestStatus(
	materialRequestId: string | undefined,
	enabled: boolean = true
): UseQueryResult<MaterialRequestStatuses | null> {
	return useQuery({
		queryKey: [QUERY_KEYS.getMaterialRequestStatus, materialRequestId],
		queryFn: (): Promise<MaterialRequestStatuses | null> =>
			MaterialRequestsService.getMaterialRequestStatusById(materialRequestId as string),
		placeholderData: keepPreviousData,
		refetchOnMount: 'always',
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		enabled: enabled && !!materialRequestId,
		refetchInterval: (query: Query<MaterialRequestStatuses | null>) => {
			const materialRequest = query.state.data;

			const hasFinalSummary =
				getLastEvent(materialRequest ?? undefined)?.messageType ===
				MaterialRequestEventType.FINAL_SUMMARY;

			if (!hasFinalSummary) {
				return 5_000;
			}
			return false;
		},
	});
}
