import { type ReactNode } from 'react';

import { type AnimationTypes, type DefaultComponentProps } from '@shared/types';

export interface OverlayProps extends DefaultComponentProps {
	children?: ReactNode;
	type?: 'dark' | 'light';
	visible?: boolean;
	animate?: AnimationTypes;
	onClick?: () => void;
	excludeScrollbar?: boolean;
}
