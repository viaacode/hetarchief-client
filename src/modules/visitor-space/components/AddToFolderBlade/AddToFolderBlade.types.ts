import { type FormBladeProps } from '@shared/types/blade';

export type AddToFolderBladeProps = FormBladeProps<string[]> & {
	objectToAdd: AddToFolderSelected | undefined;
};

export interface AddToFolderSelected {
	schemaIdentifier: string;
	title?: string; // string-only, not ReactNode
}

export interface AddToFolderFormStatePair {
	folder: string;
	ie: string;
	checked?: boolean;
}
