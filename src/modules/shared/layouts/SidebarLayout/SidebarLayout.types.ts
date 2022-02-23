import { ListNavigationItem } from '@shared/components';
import { DefaultComponentProps } from '@shared/types';

export interface SidebarLayoutProps extends DefaultComponentProps {
	contentTitle?: string;
	sidebarLinks: ListNavigationItem[];
	sidebarTitle: string;
}
