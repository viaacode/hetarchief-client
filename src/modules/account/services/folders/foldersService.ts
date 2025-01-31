import type { IPagination } from '@studiohyperdrive/pagination';
import { stringifyUrl } from 'query-string';

import type { Folder, FolderIeObject, SharedFolderResponse } from '@account/types';
import { ApiService } from '@shared/services/api-service';

import { FOLDERS_SERVICE_BASE_URL, FOLDERS_SERVICE_EXPORT_URL, FOLDERS_SERVICE_OBJECTS_URL } from './folders.const';

class FoldersService extends ApiService {
	public async getAll(): Promise<IPagination<Folder>> {
		const parsed = await ApiService.getApi().get(FOLDERS_SERVICE_BASE_URL).json();
		return parsed as IPagination<Folder>;
	}

	public async getById(
		id: string,
		searchInput = '',
		page = 0,
		size = 20
	): Promise<FolderIeObject> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${FOLDERS_SERVICE_BASE_URL}/${id}`,
					query: {
						...(searchInput ? { query: `%${searchInput}%` } : {}),
						page,
						size,
					},
				})
			)
			.json();
	}

	public async create(json: Partial<Pick<Folder, 'name'>>): Promise<Folder> {
		return await ApiService.getApi().post(`${FOLDERS_SERVICE_BASE_URL}`, { json }).json();
	}

	public async update(
		id: string,
		json: Partial<Pick<Folder, 'name' | 'description'>>
	): Promise<Folder> {
		return await ApiService.getApi()
			.patch(`${FOLDERS_SERVICE_BASE_URL}/${id}`, { json })
			.json();
	}

	public async delete(id: string): Promise<number> {
		return await ApiService.getApi().delete(`${FOLDERS_SERVICE_BASE_URL}/${id}`).json();
	}

	public async addToFolder(collection: string, item: string): Promise<unknown> {
		return await ApiService.getApi()
			.post(
				`${FOLDERS_SERVICE_BASE_URL}/${collection}/${FOLDERS_SERVICE_OBJECTS_URL}/${item}`
			)
			.json();
	}

	public async removeFromFolder(collection: string, item: string): Promise<unknown> {
		return await ApiService.getApi()
			.delete(
				`${FOLDERS_SERVICE_BASE_URL}/${collection}/${FOLDERS_SERVICE_OBJECTS_URL}/${item}`
			)
			.json();
	}

	public async getExport(id?: string): Promise<Blob | null> {
		if (!id) {
			return null;
		}
		return await ApiService.getApi()
			.get(`${FOLDERS_SERVICE_BASE_URL}/${id}/${FOLDERS_SERVICE_EXPORT_URL}`)
			.then((r) => r.blob());
	}

	public async shareCollection(collectionId: string): Promise<SharedFolderResponse> {
		return await ApiService.getApi()
			.post(`${FOLDERS_SERVICE_BASE_URL}/share/${collectionId}`)
			.json();
	}

	public async shareFolder(folderId: string, to: string): Promise<{ message: 'success' }> {
		return await ApiService.getApi()
			.post(`${FOLDERS_SERVICE_BASE_URL}/share/${folderId}/create`, { json: { to } })
			.json();
	}
}

export const foldersService = new FoldersService();
