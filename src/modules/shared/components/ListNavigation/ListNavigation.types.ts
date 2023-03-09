import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';
import { SidebarColor } from '@shared/types/sidebar';

export enum ListNavigationType {
	Navigation,
	Simple,
}

export interface ListNavigationItem {
	node: ((props: ListNavigationItemNodeProps) => ReactNode) | ReactNode;
	id: string;
	active?: boolean;
	hasDivider?: boolean;
	children?: ListNavigationItem[];
	variants?: string[];
}

export interface ListNavigationProps extends DefaultComponentProps {
	listItems: ListNavigationItem[];
	color?: SidebarColor;
	onClick?: (id: string) => void;
	type?: ListNavigationType;
}

export interface ListNavigationItemNodeProps {
	buttonClassName: string;
	linkClassName: string;
}
