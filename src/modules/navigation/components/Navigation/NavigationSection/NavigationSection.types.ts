import { type ReactNode } from 'react';

import { type IconName } from '@shared/components/Icon';

export interface NavigationItemNodeProps {
	children?: ReactNode;
	closeDropdowns: () => void;
}

export interface NavigationItem {
	node: ReactNode | ((nodeProps: NavigationItemNodeProps) => ReactNode);
	id: string;
	path: string;
	activeDesktop?: boolean;
	activeMobile?: boolean;
	isDivider?: boolean | 'md';
	children?: NavigationItem[];
}

export interface NavigationSectionProps {
	children?: ReactNode;
	currentPath?: string;
	items?: NavigationItem[];
	placement: 'left' | 'right';
	renderHamburger?: boolean;
	hamburgerProps?: NavigationHamburgerProps;
	onOpenDropdowns?: () => void;
}

export interface NavigationHamburgerProps {
	children?: ReactNode;
	openLabel: string;
	closedLabel: string;
	openIcon?: IconName;
	closedIcon?: IconName;
}
