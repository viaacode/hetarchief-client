import getConfig from 'next/config';
import { parseUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import type { LanguageInfo } from '@shared/services/translation-service/translation.types';
import { Locale } from '@shared/utils/i18n';
import { isServerSideRendering } from '@shared/utils/is-browser';

const { publicRuntimeConfig } = getConfig();

export class TranslationService {
	private static baseUrl = 'admin/translations/languages';

	public static async getAll(): Promise<LanguageInfo[]> {
		const response: LanguageInfo[] = await ApiService.getApi().get(TranslationService.baseUrl).json();

		return response ?? {};
	}

	/**
	 * Always prefer the useLocale hook for fetching the locale
	 * Since this function doesn't work in server side rendering and should only be used if the useLocale hook cannot work
	 * For instance if you're not working inside a react component context, eg polling service
	 */
	public static getLocale(): Locale {
		if (isServerSideRendering()) {
			return Locale.nl; // Window not available in server side rendering
		}
		const pageUrl = parseUrl(window.location.href).url;
		return (
			Object.values(Locale).find((languageCode) => {
				return (
					pageUrl.includes(`${publicRuntimeConfig.CLIENT_URL}/${languageCode}/`) ||
					pageUrl === `${publicRuntimeConfig.CLIENT_URL}/${languageCode}`
				);
			}) || Locale.nl
		);
	}
}
