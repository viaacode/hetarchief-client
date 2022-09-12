import { ApiService } from '@shared/services/api-service';

export type TranslationParamValue = string | number | undefined | null;

export class TranslationService {
	private static translations: Record<string, string>;

	public static async initTranslations(): Promise<void> {
		if (TranslationService.translations) {
			return;
		}
		const response = ApiService.getApi().get('translations/nl.json');
		TranslationService.translations = await response.json();
	}

	public static t(key: string, params?: Record<string, TranslationParamValue>): string {
		let translatedText = (TranslationService.translations || {})[key];
		if (!translatedText || translatedText === key) {
			if (key === ' modules/shared/components/loading/loading___laden') {
				// Special case for when the translations are not loaded yet
				translatedText = 'Laden ...';
			} else {
				console.log('Generating fallback for missing translation key: ' + key);
				// Fallback to key with *** if translation is not found
				translatedText = key.split('___')[1].replace(/-/g, ' ') + ' ***';
			}
		}
		if (params) {
			// Resolve params in translation
			Object.keys(params).forEach((key: string) => {
				translatedText = translatedText.replace(
					new RegExp(`{{${key}}}`, 'g'),
					String(params[key])
				);
			});
		}
		return translatedText;
	}
}
