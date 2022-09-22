import { stringifyUrl } from 'query-string';

import { Folder, FolderMedia } from '@account/types';
import { ApiService } from '@shared/services/api-service';
import { ApiResponseWrapper } from '@shared/types';

import {
	COLLECTIONS_SERVICE_BASE_URL,
	COLLECTIONS_SERVICE_EXPORT_URL,
	COLLECTIONS_SERVICE_OBJECTS_URL,
} from './collections.const';

class CollectionsService extends ApiService {
	public async getAll(): Promise<ApiResponseWrapper<Folder>> {
		const parsed = await ApiService.getApi().get(COLLECTIONS_SERVICE_BASE_URL).json();
		return parsed as ApiResponseWrapper<Folder>;
	}

	public async getById(id: string, searchInput = '', page = 0, size = 20): Promise<FolderMedia> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${COLLECTIONS_SERVICE_BASE_URL}/${id}`,
					query: {
						...(searchInput ? { query: `%${searchInput}%` } : {}),
						page,
						size,
					},
				})
			)
			.json();
	}

	public async create(json: Partial<Pick<Folder, 'name'>>): Promise<Partial<Folder>> {
		return await ApiService.getApi().post(`${COLLECTIONS_SERVICE_BASE_URL}`, { json }).json();
	}

	public async update(id: string, json: Partial<Pick<Folder, 'name'>>): Promise<Folder> {
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

	public async removeFromFolder(collection: string, item: string): Promise<unknown> {
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
			.then((r) => r.blob());
	}
}

export const foldersService = new CollectionsService();
