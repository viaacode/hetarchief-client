import type { DefaultComponentProps } from '@shared/types';
import type { HetArchiefIeObjectFile } from '@viaa/avo2-types';
import type { ReactNode } from 'react';

export interface FragmentSliderProps extends DefaultComponentProps {
	children?: ReactNode;
	fileRepresentations: HetArchiefIeObjectFile[];
	activeIndex: number;
	setActiveIndex: (index: number) => void;
}
