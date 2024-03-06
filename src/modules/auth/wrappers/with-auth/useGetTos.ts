import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const/query-keys';
import { GetTermsOfServiceResponse, TosService } from '@shared/services/tos-service';

export const useGetTos = (): UseQueryResult<GetTermsOfServiceResponse> => {
	return useQuery(
		[QUERY_KEYS.getTos],
		async () => {
			return TosService.getTos();
		},
		{
			keepPreviousData: true,
			enabled: true,
		}
	);
};

export const prefetchGetTos = (queryClient: QueryClient): Promise<void> => {
	return queryClient.prefetchQuery([QUERY_KEYS.getTos], async () => {
		return TosService.getTos();
	});
};
