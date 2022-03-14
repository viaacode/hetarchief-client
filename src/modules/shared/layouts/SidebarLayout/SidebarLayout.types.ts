import { ListNavigationItem } from '@shared/components';
import { Breakpoints, DefaultComponentProps } from '@shared/types';
import { SidebarColor } from '@shared/types/sidebar';

export interface SidebarLayoutProps extends DefaultComponentProps {
	contentTitle?: string;
	sidebarLinks: ListNavigationItem[];
	sidebarTitle: string;
	color?: SidebarColor;
	responsiveTo?: Breakpoints;
}
