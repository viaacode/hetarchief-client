import { DefaultComponentProps } from '@shared/types';

export interface BladeManagerProps extends DefaultComponentProps {
	children?: React.ReactNode;
	currentLayer: number;
	opacityStep?: number;
	onCloseBlade?: (layer: number) => void;
}
