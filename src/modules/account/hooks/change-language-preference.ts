import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { ApiService } from '@shared/services/api-service';
import { type Locale } from '@shared/utils/i18n';

export function useChangeLanguagePreference(language: Locale): UseMutationResult<unknown> {
	return useMutation(async () =>
		ApiService.getApi().patch('users/update-language', {
			body: JSON.stringify({ language }),
		})
	);
}
