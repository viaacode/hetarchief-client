import { FC, ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { NavigationSectionProps } from './NavigationSection';

export type NavigationFC<P = unknown> = FC<P> & {
	Left: FC<NavigationSectionProps>;
	Center: FC<NavigationCenterProps>;
	Right: FC<NavigationSectionProps>;
};

export interface NavigationProps extends DefaultComponentProps {
	children?: React.ReactNode;
	contextual?: boolean;
	loggedOutGrid?: boolean;
}

export interface NavigationCenterProps {
	children?: React.ReactNode;
	title?: ReactNode;
}

export interface NavigationItemNodeProps {
	children?: React.ReactNode;
	closeDropdowns: () => void;
}

export interface NavigationItem {
	node: ReactNode | ((nodeProps: NavigationItemNodeProps) => ReactNode);
	id: string;
	path: string;
	activeDesktop?: boolean;
	activeMobile?: boolean;
	isDivider?: boolean | 'md';
	children?: NavigationItem[];
}

export enum NAVIGATION_DROPDOWN {
	VISITOR_SPACES = '<BEZOEKERRUIMTES_DROPDOWN>',
}
