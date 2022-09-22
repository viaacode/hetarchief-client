import { ReactNode } from 'react';

import { ListNavigationItem } from '@shared/components';
import { Breakpoints, DefaultComponentProps } from '@shared/types';
import { SidebarColor } from '@shared/types/sidebar';

export interface SidebarLayoutProps extends DefaultComponentProps {
	sidebarLinks: ListNavigationItem[];
	sidebarTitle: string | ReactNode;
	color?: SidebarColor;
	responsiveTo?: Breakpoints;
}
