import { QUERY_KEYS } from '@shared/const/query-keys';
import { keepPreviousData, type UseQueryResult, useQuery } from '@tanstack/react-query';

import { MaterialRequestsService } from '../services';
import type { MaterialRequestUnreadSummary } from '../types';

/**
 * Single shared poll of the logged in user's unread conversation-message summary across
 * every material request they're involved in (as requester and/or evaluator). All consumers
 * (avatar dot, nav dropdown badges, overview table counters) use this same query key, so
 * React Query shares one cache entry and one polling interval between them — whichever
 * component is mounted when the interval fires refreshes the data for all of them.
 */
export const useGetMaterialRequestsUnreadSummary = (
	enabled = true
): UseQueryResult<MaterialRequestUnreadSummary> =>
	useQuery({
		queryKey: [QUERY_KEYS.getMaterialRequestsUnreadSummary],
		queryFn: () => MaterialRequestsService.getUnreadSummary(),
		placeholderData: keepPreviousData,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		enabled,
		refetchInterval: 15_000,
		staleTime: 15_000,
	});
