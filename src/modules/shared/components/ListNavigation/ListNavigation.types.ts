import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';
import { SidebarColor } from '@shared/types/sidebar';

export interface ListNavigationItem {
	node: ((props: ListNavigationItemNodeProps) => ReactNode) | ReactNode;
	id: string;
	active?: boolean;
	hasDivider?: boolean;
	children?: ListNavigationItem[];
}

export interface ListNavigationProps extends DefaultComponentProps {
	listItems: ListNavigationItem[];
	color?: SidebarColor;
	onClick?: (id: string) => void;
}

export interface ListNavigationItemNodeProps {
	buttonClassName: string;
	linkClassName: string;
}
