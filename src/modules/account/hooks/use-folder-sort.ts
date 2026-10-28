import { DEFAULT_FOLDER_SORT_OPTION, FolderSortOption } from '@account/const';
import { useLocalStorage } from '@shared/hooks/use-localStorage/use-local-storage';

/**
 * Remembers the chosen sort order of a folder overview in local storage, so it is kept for the next session
 * @param storageKey see FOLDER_SORT_STORAGE_KEYS
 */
export function useFolderSort(
	storageKey: string
): [FolderSortOption, (sort: FolderSortOption) => void] {
	const [storedSort, setStoredSort] = useLocalStorage(storageKey, DEFAULT_FOLDER_SORT_OPTION);
	const sort = Object.values(FolderSortOption).includes(storedSort as FolderSortOption)
		? (storedSort as FolderSortOption)
		: DEFAULT_FOLDER_SORT_OPTION;

	return [sort, setStoredSort];
}
