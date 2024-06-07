import { ApiService } from '@shared/services/api-service';
import { Locale } from '@shared/utils';

export async function getTranslations(locale: Locale): Promise<Record<string, string>> {
	try {
		return await ApiService.getApi(true).get(`admin/translations/${locale}.json`).json();
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
