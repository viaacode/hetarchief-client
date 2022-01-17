import { FC } from 'react';

import { IconLightNames } from '..';

export type NavigationFC<P = unknown> = FC<P> & {
	Left: FC<NavigationSectionProps>;
	Center: FC<NavigationCenterProps>;
	Right: FC<NavigationSectionProps>;
};

export interface NavigationProps {
	contextual?: boolean;
}

export interface NavigationCenterProps {
	title?: string;
}

export interface NavigationSectionProps {
	items?: NavigationItem[][];
	placement?: 'left' | 'right';
}

export interface NavigationLink {
	href: string;
	isActive?: boolean;
	label: string;
	id: string;
	badge?: string | number;
}

export interface NavigationItem extends NavigationLink {
	dropdown?: NavigationDropdownItem[][];
}

export interface NavigationDropdownItem extends NavigationLink {
	showOnlyOn?: 'mobile' | 'desktop';
	iconStart?: IconLightNames;
	iconEnd?: IconLightNames;
}
