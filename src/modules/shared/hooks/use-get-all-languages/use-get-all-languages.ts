import { QUERY_KEYS } from '@shared/const';
import { TranslationService } from '@shared/services/translation-service/translation.service';
import type { LanguageInfo } from '@shared/services/translation-service/translation.types';
import { type QueryClient, type UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetAllLanguages = (): UseQueryResult<LanguageInfo[]> => {
	return useQuery({
		queryKey: [QUERY_KEYS.getAllLanguages],
		queryFn: () => TranslationService.getAll(),
		staleTime: 24 * 60 * 60 * 1000,
	});
};

export async function makeServerSideRequestGetAllLanguages(queryClient: QueryClient) {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getAllLanguages],
		queryFn: () => TranslationService.getAll(),
	});
}
