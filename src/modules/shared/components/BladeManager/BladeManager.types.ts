import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

export interface BladeManagerProps extends DefaultComponentProps {
	children?: ReactNode;
	currentLayer: number;
	opacityStep?: number;
	onCloseBlade?: (layer: number) => void;
}
