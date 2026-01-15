import { NavigationService } from '@navigation/services/navigation-service';
import { QUERY_KEYS } from '@shared/const/query-keys';
import type { Locale } from '@shared/utils/i18n';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetNavigationItems(language: Locale) {
	return useQuery({
		queryKey: [QUERY_KEYS.getNavigationItems, language],
		queryFn: () => NavigationService.getAll(language),
		placeholderData: keepPreviousData,
	});
}
