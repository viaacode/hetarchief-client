import { ApiService } from '@shared/services/api-service';

import { NavigationInfo, NavigationPlacement } from './navigation.types';

export class NavigationService {
	private static baseUrl = 'admin/navigations/items';

	public static async getAll(): Promise<Record<NavigationPlacement, NavigationInfo[]>> {
		const response: Record<NavigationPlacement, NavigationInfo[]> = await ApiService.getApi()
			.get(this.baseUrl)
			.json();

		console.log('getting navigation items', response);
		return response ?? {};
	}
}
