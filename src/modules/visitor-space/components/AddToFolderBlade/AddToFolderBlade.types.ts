import type { FormBladeProps } from '@shared/types/blade';

export type AddToFolderBladeProps = FormBladeProps<string[]> & {
	/**
	 * One object: the folders that already contain the object are preselected and can be unchecked to remove it
	 * Multiple objects: the objects can only be added to the selected folders
	 */
	objectsToAdd: AddToFolderSelected[];
	/**
	 * Remove an object from the selection, only used when adding multiple objects
	 */
	onRemoveObject?: (schemaIdentifier: string) => void;
	/**
	 * Saves multiple objects to the chosen folders, only used when adding multiple objects
	 * The caller does the save, so it can keep the selection and offer a retry when it fails
	 */
	onAddMultipleObjects?: (folderIds: string[]) => Promise<void>;
};

export interface AddToFolderSelected {
	schemaIdentifier: string;
	title?: string; // string-only, not ReactNode
}
