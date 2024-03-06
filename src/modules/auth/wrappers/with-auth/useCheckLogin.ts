import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

import { AuthService, CheckLoginResponse } from '@auth/services/auth-service';
import { QUERY_KEYS } from '@shared/const/query-keys';

export const useCheckLogin = (): UseQueryResult<CheckLoginResponse> => {
	return useQuery(
		[QUERY_KEYS.checkLogin],
		async () => {
			return AuthService.checkLogin();
		},
		{
			keepPreviousData: true,
			enabled: true,
		}
	);
};

export const prefetchCheckLogin = (queryClient: QueryClient): Promise<void> => {
	return queryClient.prefetchQuery([QUERY_KEYS.checkLogin], async () => {
		return AuthService.checkLogin();
	});
};
