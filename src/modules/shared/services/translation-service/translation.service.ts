import { ApiService } from '@shared/services/api-service';
import { LanguageInfo } from '@shared/services/translation-service/translation.types';

export class TranslationService {
	private static baseUrl = 'admin/translations/languages';

	public static async getAll(): Promise<LanguageInfo[]> {
		const response: LanguageInfo[] = await ApiService.getApi().get(this.baseUrl).json();

		return response ?? {};
	}
}
