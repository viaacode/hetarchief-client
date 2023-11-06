import { AnimationTypes, DefaultComponentProps } from '@shared/types';

export interface OverlayProps extends DefaultComponentProps {
	children?: React.ReactNode;
	type?: 'dark' | 'light';
	visible?: boolean;
	animate?: AnimationTypes;
	onClick?: () => void;
	excludeScrollbar?: boolean;
}
