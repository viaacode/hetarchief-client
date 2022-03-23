import { stringify } from 'query-string';

import { ApiService } from '@shared/services/api-service';
import { ApiResponseWrapper } from '@shared/types';

import { Navigation } from './navigation.types';

import { NavigationElement } from 'modules/admin/navigation/types';

class NavigationService {
	private baseUrl = 'navigations';

	public async getAll(): Promise<Navigation[]> {
		const response: ApiResponseWrapper<Navigation> = await ApiService.getApi()
			.get(this.baseUrl)
			.json();

		return response?.items ?? [];
	}

	public async getByPlacement(placement: string): Promise<NavigationElement[]> {
		return await ApiService.getApi()
			.get(this.baseUrl, { searchParams: stringify({ placement }) })
			.json();
	}

	public async getById(id: string): Promise<NavigationElement> {
		return await ApiService.getApi().get(`${this.baseUrl}/${id}`).json();
	}

	public async updateById(id: string): Promise<NavigationElement> {
		return await ApiService.getApi().patch(`${this.baseUrl}/${id}`).json();
	}

	public async insert(): Promise<NavigationElement> {
		return await ApiService.getApi().post(this.baseUrl).json();
	}

	public async delete(id: string): Promise<unknown> {
		return await ApiService.getApi().delete(`${this.baseUrl}/${id}`).json();
	}
}

export const navigationService = new NavigationService();
