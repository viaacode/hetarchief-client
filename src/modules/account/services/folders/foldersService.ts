import type {
	AddObjectsToFoldersResponse,
	Folder,
	FolderIeObject,
	SharedFolderResponse,
} from '@account/types';
import type { IPagination } from '@meemoo/admin-core-ui/client';
import { ApiService } from '@shared/services/api-service';
import queryString from 'query-string';

import { FOLDERS_SERVICE_BASE_URL, FOLDERS_SERVICE_OBJECTS_URL } from './folders.const';

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
	): Promise<IPagination<FolderIeObject>> {
		return await ApiService.getApi()
			.get(
				queryString.stringifyUrl({
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

	/**
	 * Create a personal folder, or an organisation folder when isOrganisation is true
	 * Organisation folders require the MANAGE_ORGANISATION_FOLDERS permission
	 */
	public static async create(
		json: Partial<Pick<Folder, 'name' | 'description'>> & { isOrganisation?: boolean }
	): Promise<Folder> {
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

	/**
	 * Add multiple objects to multiple folders in one request
	 * Objects that are already in a folder are skipped, so a failed request can safely be retried
	 */
	public static async addManyToFolders(
		folderUuids: string[],
		objectSchemaIdentifiers: string[]
	): Promise<AddObjectsToFoldersResponse> {
		return await ApiService.getApi()
			.post(`${FOLDERS_SERVICE_BASE_URL}/${FOLDERS_SERVICE_OBJECTS_URL}`, {
				json: { folderIds: folderUuids, objectSchemaIdentifiers },
			})
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
