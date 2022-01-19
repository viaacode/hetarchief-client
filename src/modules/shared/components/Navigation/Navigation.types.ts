import { FC, ReactNode } from 'react';

export type NavigationFC<P = unknown> = FC<P> & {
	Left: FC<NavigationSectionProps>;
	Center: FC<NavigationCenterProps>;
	Right: FC<NavigationSectionProps>;
};

export interface NavigationProps {
	contextual?: boolean;
}

export interface NavigationCenterProps {
	title?: string;
}

export interface NavigationSectionProps {
	items?: NavigationItem[];
	placement?: 'left' | 'right';
}

export interface NavigationItem {
	node: ReactNode;
	id: string;
	active?: boolean;
	hasDivider?: boolean;
	children?: NavigationItem[];
}
