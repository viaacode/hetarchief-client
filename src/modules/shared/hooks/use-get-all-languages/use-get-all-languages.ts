import { type QueryClient, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';
import { TranslationService } from '@shared/services/translation-service/translation.service';
import type { LanguageInfo } from '@shared/services/translation-service/translation.types';

export const useGetAllLanguages = (): UseQueryResult<LanguageInfo[]> => {
	return useQuery(
		[QUERY_KEYS.getAllLanguages],
		() => {
			return TranslationService.getAll();
		},
		{
			cacheTime: 24 * 60 * 60 * 1000,
		}
	);
};

export async function makeServerSideRequestGetAllLanguages(queryClient: QueryClient) {
	await queryClient.prefetchQuery([QUERY_KEYS.getAllLanguages], () => TranslationService.getAll());
}
