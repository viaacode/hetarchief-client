import { DEFAULT_FOLDER_SORT_OPTION, FolderSortOption } from '@account/const';
import type { Folder } from '@account/types';
import { orderBy } from 'es-toolkit/compat';

export function isOrganisationFolder(folder: Pick<Folder, 'ownerOrganisationId'>): boolean {
	return !!folder.ownerOrganisationId;
}

/**
 * The folders endpoint returns both personal and organisation folders, these helpers split them
 */
export function getPersonalFolders<T extends Pick<Folder, 'ownerOrganisationId'>>(
	folders: T[] | null | undefined
): T[] {
	return (folders || []).filter((folder) => !isOrganisationFolder(folder));
}

export function getOrganisationFolders<T extends Pick<Folder, 'ownerOrganisationId'>>(
	folders: T[] | null | undefined
): T[] {
	return (folders || []).filter((folder) => isOrganisationFolder(folder));
}

/**
 * Sort folders, the default folder (favorites) is always kept at the top regardless of the sort order
 * There should only be one default folder per user, but if there are multiple, they are all kept at the top
 */
export function sortFolders<T extends Pick<Folder, 'name' | 'createdAt' | 'isDefault'>>(
	folders: T[] | null | undefined,
	sortOption: FolderSortOption = DEFAULT_FOLDER_SORT_OPTION
): T[] {
	const defaultFolders = (folders || []).filter((folder) => folder.isDefault);
	const otherFolders = (folders || []).filter((folder) => !folder.isDefault);

	let sortedFolders: T[];
	switch (sortOption) {
		case FolderSortOption.NAME_ASC:
		case FolderSortOption.NAME_DESC:
			sortedFolders = [...otherFolders].sort((a, b) =>
				(a.name || '').localeCompare(b.name || '', undefined, {
					sensitivity: 'base',
					numeric: true,
				})
			);
			if (sortOption === FolderSortOption.NAME_DESC) {
				sortedFolders.reverse();
			}
			break;

		case FolderSortOption.OLDEST_FIRST:
			sortedFolders = orderBy(otherFolders, [(folder) => folder.createdAt], ['asc']);
			break;

		default:
			sortedFolders = orderBy(otherFolders, [(folder) => folder.createdAt], ['desc']);
			break;
	}

	return [...defaultFolders, ...sortedFolders];
}
