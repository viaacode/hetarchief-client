import { ApiService } from '@shared/services/api-service';
import type { Locale } from '@shared/utils/i18n';
import { LRUCache } from 'lru-cache';

const translationCache = new LRUCache({ max: 2, ttl: 1000 * 60 * 60 }); // Cache for 1 hour

export async function getTranslations(locale: Locale): Promise<Record<string, string>> {
	try {
		let translations: Record<string, string> | undefined = translationCache.get(locale);
		if (!translations) {
			translations = await ApiService.getApi(true).get(`admin/translations/${locale}.json`).json();
			translationCache.set(locale, translations);
		}
		return translations as Record<string, string>;
	} catch (err) {
		console.error({
			message: 'Failed to fetch translations from the backend',
			innerException: err,
			additionalInfo: {
				locale,
				nl: 'admin/translations/nl.json',
				en: 'admin/translations/en.json',
			},
		});
		return Promise.resolve({});
	}
}
