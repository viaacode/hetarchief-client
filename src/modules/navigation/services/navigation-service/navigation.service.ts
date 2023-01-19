import { ApiService } from '@shared/services/api-service';

import { NavigationInfo, NavigationPlacement } from './navigation.types';

class NavigationService {
	private baseUrl = 'admin/navigations/items';

	public async getAll(): Promise<Record<NavigationPlacement, NavigationInfo[]>> {
		const response: Record<NavigationPlacement, NavigationInfo[]> = await ApiService.getApi()
			.get(this.baseUrl)
			.json();

		return response ?? {};
	}
}

export const navigationService = new NavigationService();
