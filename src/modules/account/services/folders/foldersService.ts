import type { IPagination } from '@studiohyperdrive/pagination';
import { stringifyUrl } from 'query-string';

import type { Folder, FolderIeObject, SharedFolderResponse } from '@account/types';
import { ApiService } from '@shared/services/api-service';

import type { IeObject } from '@ie-objects/ie-objects.types';
import { FOLDERS_SERVICE_BASE_URL, FOLDERS_SERVICE_OBJECTS_URL } from './folders.const';

export namespace FoldersService {
	export async function getAll(): Promise<IPagination<Folder>> {
		const parsed = await ApiService.getApi().get(FOLDERS_SERVICE_BASE_URL).json();
		return parsed as IPagination<Folder>;
	}

	export async function getById(
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

	export async function create(json: Partial<Pick<Folder, 'name'>>): Promise<Folder> {
		return await ApiService.getApi().post(`${FOLDERS_SERVICE_BASE_URL}`, { json }).json();
	}

	export async function update(
		id: string,
		json: Partial<Pick<Folder, 'name' | 'description'>>
	): Promise<Folder> {
		return await ApiService.getApi().patch(`${FOLDERS_SERVICE_BASE_URL}/${id}`, { json }).json();
	}

	export async function remove(id: string): Promise<number> {
		return await ApiService.getApi().delete(`${FOLDERS_SERVICE_BASE_URL}/${id}`).json();
	}

	export async function addToFolder(folderId: string, item: string): Promise<unknown> {
		return await ApiService.getApi()
			.post(`${FOLDERS_SERVICE_BASE_URL}/${folderId}/${FOLDERS_SERVICE_OBJECTS_URL}/${item}`)
			.json();
	}

	export async function removeFromFolder(
		folderId: string,
		item: string
	): Promise<Partial<IeObject> & { folderEntryCreatedAt: string }> {
		return await ApiService.getApi()
			.delete(`${FOLDERS_SERVICE_BASE_URL}/${folderId}/${FOLDERS_SERVICE_OBJECTS_URL}/${item}`)
			.json();
	}

	// export async function getExport(id?: string): Promise<Blob | null> {
	// 	if (!id) {
	// 		return null;
	// 	}
	// 	return await ApiService.getApi()
	// 		.get(`${FOLDERS_SERVICE_BASE_URL}/${id}/${FOLDERS_SERVICE_EXPORT_URL}`)
	// 		.then((r) => r.blob());
	// }

	export async function shareCollection(folderId: string): Promise<SharedFolderResponse> {
		return await ApiService.getApi().post(`${FOLDERS_SERVICE_BASE_URL}/share/${folderId}`).json();
	}

	export async function shareFolder(folderId: string, to: string): Promise<{ message: 'success' }> {
		return await ApiService.getApi()
			.post(`${FOLDERS_SERVICE_BASE_URL}/share/${folderId}/create`, {
				json: { to },
			})
			.json();
	}
}
