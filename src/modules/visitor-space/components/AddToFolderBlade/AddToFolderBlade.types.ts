import { FormBladeProps } from '@shared/types';

export type AddToFolderBladeProps = FormBladeProps<string[]> & {
	objectToAdd: AddToFolderSelected;
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
