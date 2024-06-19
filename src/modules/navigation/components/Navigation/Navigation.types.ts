import { type FC, type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

import { type NavigationSectionProps } from './NavigationSection/NavigationSection.types';

export type NavigationFC<P = unknown> = FC<P> & {
	Left: FC<NavigationSectionProps>;
	Center: FC<NavigationCenterProps>;
	Right: FC<NavigationSectionProps>;
};

export interface NavigationProps extends DefaultComponentProps {
	children?: ReactNode;
	contextual?: boolean;
	loggedOutGrid?: boolean;
}

export interface NavigationCenterProps {
	children?: ReactNode;
	title?: ReactNode;
}

export enum NAVIGATION_DROPDOWN {
	VISITOR_SPACES = '<BEZOEKERRUIMTES_DROPDOWN>',
}
