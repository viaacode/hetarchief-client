import { FormBladeProps } from '@shared/types';

export type AddToFolderBladeProps = FormBladeProps<AddToFolderFormState> & {
	selected?: AddToFolderSelected;
};

export interface AddToFolderFormState {
	pairs: AddToFolderFormStatePair[];
}

export interface AddToFolderSelected {
	schemaIdentifier: string;
	title?: string; // string-only, not ReactNode
}

export interface AddToFolderFormStatePair {
	folder: string;
	ie: string;
	checked?: boolean;
}
