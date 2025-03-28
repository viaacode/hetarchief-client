import type { IPagination } from '@studiohyperdrive/pagination';
import { stringifyUrl } from 'query-string';

import type { Folder, FolderIeObject, SharedFolderResponse } from '@account/types';
import { ApiService } from '@shared/services/api-service';

import {
	FOLDERS_SERVICE_BASE_URL,
	FOLDERS_SERVICE_EXPORT_URL,
	FOLDERS_SERVICE_OBJECTS_URL,
} from './folders.const';

export abstract class FoldersService {
	public static async getAll(): Promise<IPagination<Folder>> {
		const parsed = await ApiService.getApi().get(FOLDERS_SERVICE_BASE_URL).json();
		return parsed as IPagination<Folder>;
	}

	public static async getById(
		folderUuid: string,
		searchInput = '',
		page = 0,
		size = 20
	): Promise<FolderIeObject> {
		return await ApiService.getApi()
			.get(
				stringifyUrl({
					url: `${FOLDERS_SERVICE_BASE_URL}/${folderUuid}`,
					query: {
						...(searchInput ? { query: `%${searchInput}%` } : {}),
						page,
						size,
					},
				})
			)
			.json();
	}

	public static async create(json: Partial<Pick<Folder, 'name'>>): Promise<Folder> {
		return await ApiService.getApi().post(`${FOLDERS_SERVICE_BASE_URL}`, { json }).json();
	}

	public static async update(
		folderUuid: string,
		json: Partial<Pick<Folder, 'name' | 'description'>>
	): Promise<Folder> {
		return await ApiService.getApi()
			.patch(`${FOLDERS_SERVICE_BASE_URL}/${folderUuid}`, { json })
			.json();
	}

	public static async delete(folderUuid: string): Promise<number> {
		return await ApiService.getApi().delete(`${FOLDERS_SERVICE_BASE_URL}/${folderUuid}`).json();
	}

	public static async addToFolder(
		folderUuid: string,
		objectSchemaIdentifier: string
	): Promise<unknown> {
		return await ApiService.getApi()
			.post(
				`${FOLDERS_SERVICE_BASE_URL}/${folderUuid}/${FOLDERS_SERVICE_OBJECTS_URL}/${objectSchemaIdentifier}`
			)
			.json();
	}

	public static async removeFromFolder(
		folderUuid: string,
		objectSchemaIdentifier: string
	): Promise<unknown> {
		return await ApiService.getApi()
			.delete(
				`${FOLDERS_SERVICE_BASE_URL}/${folderUuid}/${FOLDERS_SERVICE_OBJECTS_URL}/${objectSchemaIdentifier}`
			)
			.json();
	}

	public static async getExport(folderUuid?: string): Promise<Blob | null> {
		if (!folderUuid) {
			return null;
		}
		return await ApiService.getApi()
			.get(`${FOLDERS_SERVICE_BASE_URL}/${folderUuid}/${FOLDERS_SERVICE_EXPORT_URL}`)
			.then((r) => r.blob());
	}

	/**
	 * Create an invite to share a folder
	 * @param folderUuid
	 * @param toEmail
	 */
	public static async shareFolderCreate(
		folderUuid: string,
		toEmail: string
	): Promise<{ message: 'success' }> {
		return await ApiService.getApi()
			.post(`${FOLDERS_SERVICE_BASE_URL}/share/${folderUuid}/create`, {
				json: { to: toEmail },
			})
			.json();
	}

	/**
	 * Accept a folder invite and copy the shared folder to the current user
	 * @param folderUuid
	 */
	public static async shareFolder(folderUuid: string): Promise<SharedFolderResponse> {
		return await ApiService.getApi().post(`${FOLDERS_SERVICE_BASE_URL}/share/${folderUuid}`).json();
	}
}
