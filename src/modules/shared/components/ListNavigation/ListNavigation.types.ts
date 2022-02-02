import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface ListNavigationItem {
	node: ReactNode;
	id: string;
	active?: boolean;
	hasDivider?: boolean;
	children?: ListNavigationItem[];
}

export interface ListNavigationProps extends DefaultComponentProps {
	listItems: ListNavigationItem[];
	type?: 'primary' | 'secondary';
	onClick?: (id: string) => void;
}
