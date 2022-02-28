import { Collection } from '@account/types';
import { ApiService } from '@shared/services';
import { ApiResponseWrapper } from '@shared/types';

import { COLLECTIONS_SERVICE_BASE_URL } from './collections.const';

class CollectionsService extends ApiService {
	public async getAll(): Promise<ApiResponseWrapper<Collection>> {
		const parsed = await ApiService.getApi().get(COLLECTIONS_SERVICE_BASE_URL).json();
		return parsed as ApiResponseWrapper<Collection>;
	}

	public async getById(id: string): Promise<Collection> {
		return await ApiService.getApi().get(`${COLLECTIONS_SERVICE_BASE_URL}/${id}`).json();
	}

	public async create(json: Partial<Pick<Collection, 'name'>>): Promise<Partial<Collection>> {
		return await ApiService.getApi().post(`${COLLECTIONS_SERVICE_BASE_URL}`, { json }).json();
	}

	public async update(id: string, json: Partial<Pick<Collection, 'name'>>): Promise<Collection> {
		return await ApiService.getApi()
			.put(`${COLLECTIONS_SERVICE_BASE_URL}/${id}`, { json })
			.json();
	}
}

export const collectionsService = new CollectionsService();
