import { FormBladeProps } from '@shared/types';

export type AddToCollectionBladeProps = FormBladeProps<AddToCollectionFormState> & {
	selected?: AddToCollectionSelected;
};

export interface AddToCollectionFormState {
	pairs: AddToCollectionFormStatePair[];
}

export interface AddToCollectionSelected {
	schemaIdentifier: string;
	title?: string; // string-only, not ReactNode
}

export interface AddToCollectionFormStatePair {
	folder: string;
	ie: string;
	checked?: boolean;
}
