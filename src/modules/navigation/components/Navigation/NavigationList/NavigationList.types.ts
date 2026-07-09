import type { NavigationItem } from '@navigation/components/Navigation/NavigationSection/NavigationSection.types';
import type { ReactNode } from 'react';

export interface NavigationListProps {
	children?: ReactNode;
	currentPath?: string;
	items: NavigationItem[];
	onOpenDropdowns?: () => void;
}
