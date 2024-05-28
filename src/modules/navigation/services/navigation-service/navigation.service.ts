import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import { Locale } from '@shared/utils';

import { NavigationInfo, NavigationPlacement } from './navigation.types';

export class NavigationService {
	private static baseUrl = 'admin/navigations/items';

	public static async getAll(
		locale: Locale
	): Promise<Record<NavigationPlacement, NavigationInfo[]>> {
		const response: Record<NavigationPlacement, NavigationInfo[]> = await ApiService.getApi()
			.get(stringifyUrl({ url: this.baseUrl, query: { languageCode: locale } }))
			.json();

		return response ?? {};
	}
}
