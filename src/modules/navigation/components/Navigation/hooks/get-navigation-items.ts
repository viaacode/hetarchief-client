import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { NavigationInfo, NavigationService } from '@navigation/services/navigation-service';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { Locale } from '@shared/utils';

export function useGetNavigationItems(
	language: Locale
): UseQueryResult<Record<string, NavigationInfo[]>> {
	return useQuery(
		[QUERY_KEYS.getNavigationItems, language],
		() => NavigationService.getAll(language),
		{
			keepPreviousData: true,
		}
	);
}
