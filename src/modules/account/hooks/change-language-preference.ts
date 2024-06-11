import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { ApiService } from '@shared/services/api-service';
import { Locale } from '@shared/utils';

export function useChangeLanguagePreference(language: Locale): UseMutationResult<unknown> {
	return useMutation(async () =>
		ApiService.getApi().patch('users/update-language', {
			body: JSON.stringify({ language }),
		})
	);
}
