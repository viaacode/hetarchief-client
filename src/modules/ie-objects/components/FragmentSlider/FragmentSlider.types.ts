import { type ReactNode } from 'react';

import { type IeObjectRepresentation } from '@ie-objects/ie-objects.types';
import { type DefaultComponentProps } from '@shared/types';

export interface FragmentSliderProps extends DefaultComponentProps {
	children?: ReactNode;
	thumbnail?: string;
	fragments: IeObjectRepresentation[];
	onChangeFragment?: (index: number) => void;
}
