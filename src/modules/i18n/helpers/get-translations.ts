import { ApiService } from '@shared/services/api-service';

export async function getTranslations(): Promise<Record<string, string>> {
	try {
		return await ApiService.getApi(true).get('admin/translations/nl.json').json();
	} catch (err) {
		console.error({
			message: 'Failed to fetch translations from the backend',
			innerException: err,
			additionalInfo: 'admin/translations/nl.json',
		});
		return {};
	}
}
