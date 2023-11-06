import { IconName } from '@shared/components';

import { NavigationItem } from '../Navigation.types';

export interface NavigationSectionProps {
	children?: React.ReactNode;
	currentPath?: string;
	items?: NavigationItem[];
	placement: 'left' | 'right';
	renderHamburger?: boolean;
	hamburgerProps?: NavigationHamburgerProps;
	onOpenDropdowns?: () => void;
}

export interface NavigationHamburgerProps {
	children?: React.ReactNode;
	openLabel: string;
	closedLabel: string;
	openIcon?: IconName;
	closedIcon?: IconName;
}
