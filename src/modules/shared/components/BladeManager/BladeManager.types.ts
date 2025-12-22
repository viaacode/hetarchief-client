import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface BladeManagerProps extends DefaultComponentProps {
	children?: ReactNode;
	currentLayer: number;
	opacityStep?: number;
	onCloseBlade?: (layer: number, currentLayer: number) => void;
}
