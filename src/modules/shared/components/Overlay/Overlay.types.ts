import type { AnimationTypes, DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface OverlayProps extends DefaultComponentProps {
	children?: ReactNode;
	type?: 'dark' | 'light';
	visible?: boolean;
	animate?: AnimationTypes;
	onClick?: () => void;
	excludeScrollbar?: boolean;
}
