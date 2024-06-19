import { type ReactNode } from 'react';

import { type ListNavigationItem } from '@shared/components/ListNavigation';
import { type Breakpoints, type DefaultComponentProps } from '@shared/types';
import { type SidebarColor } from '@shared/types/sidebar';

export interface SidebarLayoutProps extends DefaultComponentProps {
	children?: ReactNode;
	sidebarTitle: string | ReactNode;
	sidebarLinks?: ListNavigationItem[];
	color?: SidebarColor;
	responsiveTo?: Breakpoints;
}
