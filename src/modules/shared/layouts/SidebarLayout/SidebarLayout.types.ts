import type { ListNavigationItem } from '@shared/components/ListNavigation';
import type { Breakpoints, DefaultComponentProps } from '@shared/types';
import type { SidebarColor } from '@shared/types/sidebar';
import type { ReactNode } from 'react';

export interface SidebarLayoutProps extends DefaultComponentProps {
	children?: ReactNode;
	sidebarTitle: string | ReactNode;
	sidebarLinks?: ListNavigationItem[];
	color?: SidebarColor;
	responsiveTo?: Breakpoints;
}
