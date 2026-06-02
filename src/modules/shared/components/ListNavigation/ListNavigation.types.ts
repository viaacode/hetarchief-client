import type { DefaultComponentProps } from '@shared/types';
import type { SidebarColor } from '@shared/types/sidebar';
import type { ReactNode } from 'react';

export enum ListNavigationType {
	Navigation = 0,
	Simple = 1,
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
	children?: ReactNode;
	listItems: ListNavigationItem[];
	color?: SidebarColor;
	onClick?: (id: string) => void;
	type?: ListNavigationType;
}

interface ListNavigationItemNodeProps {
	children?: ReactNode;
	buttonClassName: string;
	linkClassName: string;
}
