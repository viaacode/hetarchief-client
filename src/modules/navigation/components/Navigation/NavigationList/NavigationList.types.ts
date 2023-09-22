import { NavigationItem } from '../Navigation.types';

export interface NavigationListProps {
	children?: React.ReactNode;
	currentPath?: string;
	items: NavigationItem[];
	onOpenDropdowns?: () => void;
}
