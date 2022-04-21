import { i18n } from 'next-i18next';
import { stringifyUrl } from 'query-string';

import { Collection, CollectionMedia } from '@account/types';
import { ApiService } from '@shared/services/api-service';
import { toastService } from '@shared/services/toast-service';
import { ApiResponseWrapper } from '@shared/types';

import {
	COLLECTIONS_SERVICE_BASE_URL,
	COLLECTIONS_SERVICE_EXPORT_URL,
	COLLECTIONS_SERVICE_OBJECTS_URL,
} from './collections.const';

class CollectionsService extends ApiService {
	public async getAll(): Promise<ApiResponseWrapper<Collection>> {
		const parsed = await ApiService.getApi().get(COLLECTIONS_SERVICE_BASE_URL).json();
		return parsed as ApiResponseWrapper<Collection>;
	}

	public async getById(
		id: string,
		searchInput = '',
		page = 0,
		size = 20
	): Promise<CollectionMedia> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${COLLECTIONS_SERVICE_BASE_URL}/${id}`,
					query: {
						query: `%${searchInput}%`,
						page,
						size,
					},
				})
			)
			.json();
	}

	public async create(json: Partial<Pick<Collection, 'name'>>): Promise<Partial<Collection>> {
		return await ApiService.getApi().post(`${COLLECTIONS_SERVICE_BASE_URL}`, { json }).json();
	}

	public async update(id: string, json: Partial<Pick<Collection, 'name'>>): Promise<Collection> {
		return await ApiService.getApi()
			.patch(`${COLLECTIONS_SERVICE_BASE_URL}/${id}`, { json })
			.json();
	}

	public async delete(id: string): Promise<number> {
		return await ApiService.getApi().delete(`${COLLECTIONS_SERVICE_BASE_URL}/${id}`).json();
	}

	public async addToCollection(collection: string, item: string): Promise<unknown> {
		return await ApiService.getApi()
			.post(
				`${COLLECTIONS_SERVICE_BASE_URL}/${collection}/${COLLECTIONS_SERVICE_OBJECTS_URL}/${item}`
			)
			.json();
	}

	public async removeFromCollection(collection: string, item: string): Promise<unknown> {
		return await ApiService.getApi()
			.delete(
				`${COLLECTIONS_SERVICE_BASE_URL}/${collection}/${COLLECTIONS_SERVICE_OBJECTS_URL}/${item}`
			)
			.json();
	}

	public async getExport(id?: string): Promise<Blob | null> {
		if (!id) {
			return null;
		}
		return await ApiService.getApi()
			.get(`${COLLECTIONS_SERVICE_BASE_URL}/${id}/${COLLECTIONS_SERVICE_EXPORT_URL}`)
			.then((r) => r.blob())
			.catch((error) => {
				toastService.notify({
					title:
						i18n?.t(
							'modules/account/services/collections/collections___er-ging-iets-mis'
						) || 'error',
					description: error,
				});
				return null;
			});
	}
}

export const collectionsService = new CollectionsService();
