import { FormBladeProps } from '@shared/types';

export type AddToCollectionBladeProps = FormBladeProps<AddToCollectionFormState> &
	Partial<Pick<AddToCollectionFormState, 'selected'>>;

export interface AddToCollectionFormState {
	selected: AddToCollectionSelected;
	pairs: AddToCollectionFormStatePair[];
}

export interface AddToCollectionSelected {
	schemaIdentifier: string;
	title?: string;
}

export interface AddToCollectionFormStatePair {
	id: string;
	checked?: boolean;
}
