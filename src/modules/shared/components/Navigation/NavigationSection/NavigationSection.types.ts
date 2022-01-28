import { IconLightNames } from '../../Icon';
import { NavigationItem } from '../Navigation.types';

export interface NavigationSectionProps {
	items?: NavigationItem[];
	placement: 'left' | 'right';
	renderHamburger?: boolean;
	hamburgerProps?: NavigationHamburgerProps;
}

export interface NavigationHamburgerProps {
	openLabel: string;
	closedLabel: string;
	openIcon?: IconLightNames;
	closedIcon?: IconLightNames;
}
