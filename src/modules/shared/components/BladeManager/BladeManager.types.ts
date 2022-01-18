import { DefaultComponentProps } from '@shared/types';

export interface BladeManagerProps extends DefaultComponentProps {
	currentLayer: number;
	opacityStep?: number;
}
