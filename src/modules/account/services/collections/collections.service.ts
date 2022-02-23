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
}

export const collectionsService = new CollectionsService();
