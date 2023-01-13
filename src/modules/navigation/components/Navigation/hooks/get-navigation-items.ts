import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { NavigationInfo, navigationService } from '@navigation/services/navigation-service';
import { QUERY_KEYS } from '@shared/const/query-keys';

export function useGetNavigationItems(): UseQueryResult<Record<string, NavigationInfo[]>> {
	return useQuery([QUERY_KEYS.getNavigationItems], () => navigationService.getAll(), {
		keepPreviousData: true,
	});
}
