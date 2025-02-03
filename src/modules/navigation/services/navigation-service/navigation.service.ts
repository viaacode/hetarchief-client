import { stringifyUrl } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import type { Locale } from '@shared/utils/i18n';

import type { NavigationInfo, NavigationPlacement } from './navigation.types';

// TODO convert to react-query
export namespace NavigationService {
	const baseUrl = 'admin/navigations/items';

	export async function getAll(
		language: Locale
	): Promise<Record<NavigationPlacement, NavigationInfo[]>> {
		const response: Record<NavigationPlacement, NavigationInfo[]> = await ApiService.getApi()
			.get(stringifyUrl({ url: baseUrl, query: { language } }))
			.json();

		return response ?? {};
	}
}
