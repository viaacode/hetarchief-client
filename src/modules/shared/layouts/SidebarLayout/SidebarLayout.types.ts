import { ReactNode } from 'react';

import { ListNavigationItem } from '@shared/components';
import { Breakpoints, DefaultComponentProps } from '@shared/types';
import { SidebarColor } from '@shared/types/sidebar';

export interface SidebarLayoutProps extends DefaultComponentProps {
	children?: React.ReactNode;
	sidebarTitle: string | ReactNode;
	sidebarLinks?: ListNavigationItem[];
	color?: SidebarColor;
	responsiveTo?: Breakpoints;
}
