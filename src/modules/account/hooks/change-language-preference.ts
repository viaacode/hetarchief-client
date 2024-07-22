import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type KyResponse } from 'ky';

import { ApiService } from '@shared/services/api-service';
import { type Locale } from '@shared/utils/i18n';

export function useChangeLanguagePreference(): UseMutationResult<
	KyResponse,
	unknown,
	Locale,
	unknown
> {
	return useMutation(async (language: Locale) =>
		ApiService.getApi().patch('users/update-language', {
			body: JSON.stringify({ language }),
		})
	);
}
