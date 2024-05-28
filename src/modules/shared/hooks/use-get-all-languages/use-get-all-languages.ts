import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/const';
import { TranslationService } from '@shared/services/translation-service/translation.service';
import { LanguageInfo } from '@shared/services/translation-service/translation.types';

export const useGetAllLanguages = (): UseQueryResult<LanguageInfo[]> => {
	return useQuery([QUERY_KEYS.getAllLanguages], () => {
		return TranslationService.getAll();
	});
};
