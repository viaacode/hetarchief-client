import { FC, ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { IconLightNames } from '../Icon';

export type NavigationFC<P = unknown> = FC<P> & {
	Left: FC<NavigationSectionProps>;
	Center: FC<NavigationCenterProps>;
	Right: FC<NavigationSectionProps>;
};

export interface NavigationProps extends DefaultComponentProps {
	contextual?: boolean;
}

export interface NavigationCenterProps {
	title?: string;
}

export interface NavigationSectionProps {
	items?: NavigationItem[];
	placement: 'left' | 'right';
	renderHamburger?: boolean;
	hamburgerProps?: NavigationHamburgerProps;
}

export interface NavigationItem {
	node: ReactNode;
	id: string;
	active?: boolean;
	hasDivider?: boolean;
	children?: NavigationItem[];
}

export interface NavigationHamburgerProps {
	hamburgerLabelOpen: string;
	hamburgerLabelClosed: string;
	hamburgerIconOpen?: IconLightNames;
	hamburgerIconClosed?: IconLightNames;
}
