import { IconLightNames } from '../../Icon';
import { NavigationItem } from '../Navigation.types';

export interface NavigationSectionProps {
	currentPath?: string;
	items?: NavigationItem[];
	placement: 'left' | 'right';
	renderHamburger?: boolean;
	hamburgerProps?: NavigationHamburgerProps;
	onOpenDropdowns?: () => void;
}

export interface NavigationHamburgerProps {
	openLabel: string;
	closedLabel: string;
	openIcon?: IconLightNames;
	closedIcon?: IconLightNames;
}
