import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { type NavigationInfo, NavigationService } from '@navigation/services/navigation-service';
import { QUERY_KEYS } from '@shared/const/query-keys';
import type { Locale } from '@shared/utils/i18n';

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
