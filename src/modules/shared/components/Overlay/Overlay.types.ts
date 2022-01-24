import { AnimationTypes, DefaultComponentProps } from '@shared/types';

export interface OverlayProps extends DefaultComponentProps {
	type?: 'dark' | 'light';
	visible?: boolean;
	animate?: AnimationTypes;
	onClick?: () => void;
}
