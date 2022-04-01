import { ReactNode } from 'react';

import { FormBladeProps } from '@shared/types';

export type AddToCollectionBladeProps = FormBladeProps<AddToCollectionFormState> & {
	selected?: AddToCollectionSelected;
};

export interface AddToCollectionFormState {
	pairs: AddToCollectionFormStatePair[];
}

export interface AddToCollectionSelected {
	schemaIdentifier: string;
	title?: string | ReactNode;
}

export interface AddToCollectionFormStatePair {
	id: string;
	checked?: boolean;
}
