import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import type { Locale } from '@shared/utils/i18n';

import type { NavigationInfo, NavigationPlacement } from './navigation.types';

export class NavigationService {
	private static baseUrl = 'admin/navigations/items';

	public static async getAll(
		language: Locale
	): Promise<Record<NavigationPlacement, NavigationInfo[]>> {
		const response: Record<NavigationPlacement, NavigationInfo[]> = await ApiService.getApi()
			.get(stringifyUrl({ url: this.baseUrl, query: { language } }))
			.json();

		return response ?? {};
	}
}
