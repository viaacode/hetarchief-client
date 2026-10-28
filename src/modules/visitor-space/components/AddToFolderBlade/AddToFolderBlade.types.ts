import type { FormBladeProps } from '@shared/types/blade';

export type AddToFolderBladeProps = FormBladeProps<string[]> & {
	/**
	 * Folders that contain all objects are checked, folders that contain some of them are indeterminate
	 * Checking a folder adds the objects to it, unchecking it removes them
	 */
	objectsToAdd: AddToFolderSelected[];
	/**
	 * Adds multiple objects to and removes them from the chosen folders, only used with multiple objects
	 * The caller does the save, so it can keep the selection and offer a retry when it fails
	 */
	onSaveMultipleObjects?: (changes: FolderChanges) => Promise<void>;
};

export interface FolderChanges {
	addToFolderIds: string[];
	removeFromFolderIds: string[];
}

export interface AddToFolderSelected {
	schemaIdentifier: string;
	title?: string; // string-only, not ReactNode
}
