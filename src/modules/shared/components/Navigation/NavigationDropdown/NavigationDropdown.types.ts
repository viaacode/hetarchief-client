import { NavigationItem } from '../Navigation.types';

export interface NavigationDropdownProps {
	items: NavigationItem[][];
	onOpen: () => void;
	onClose: () => void;
}
