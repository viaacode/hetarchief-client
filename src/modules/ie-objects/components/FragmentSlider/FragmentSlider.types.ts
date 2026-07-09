import type { IeObjectFile } from '@ie-objects/ie-objects.types';
import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface FragmentSliderProps extends DefaultComponentProps {
	children?: ReactNode;
	fileRepresentations: IeObjectFile[];
	activeIndex: number;
	setActiveIndex: (index: number) => void;
}
