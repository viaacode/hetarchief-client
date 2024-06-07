import getConfig from 'next/config';
import { parseUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import { LanguageInfo } from '@shared/services/translation-service/translation.types';
import { isServerSideRendering, Locale } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

export class TranslationService {
	private static baseUrl = 'admin/translations/languages';

	public static async getAll(): Promise<LanguageInfo[]> {
		const response: LanguageInfo[] = await ApiService.getApi().get(this.baseUrl).json();

		return response ?? {};
	}

	public static getLocale(): Locale {
		if (isServerSideRendering()) {
			return Locale.nl; // Window not available in server side rendering
		}
		const pageUrl = parseUrl(window.location.href).url;
		return (
			Object.values(Locale).find((languageCode) => {
				return (
					pageUrl.includes(publicRuntimeConfig.CLIENT_URL + '/' + languageCode + '/') ||
					pageUrl === publicRuntimeConfig.CLIENT_URL + '/' + languageCode
				);
			}) || Locale.nl
		);
	}
}
