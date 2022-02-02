import { NavigationItem } from '../Navigation.types';

export interface NavigationListProps {
	currentPath?: string;
	items: NavigationItem[];
}
