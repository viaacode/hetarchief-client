import { type ReactNode } from 'react';

import { type NavigationItem } from '@navigation/components/Navigation/NavigationSection/NavigationSection.types';

export interface NavigationListProps {
	children?: ReactNode;
	currentPath?: string;
	items: NavigationItem[];
	onOpenDropdowns?: () => void;
}
