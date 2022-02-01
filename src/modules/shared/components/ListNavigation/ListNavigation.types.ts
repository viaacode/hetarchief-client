import { ReactNode } from 'react';

import { ComponentLink, DefaultComponentProps } from '@shared/types';

export interface ListNavigationLink extends Omit<ComponentLink, 'icon'> {
	active?: boolean;
}

export interface ListNavigationButton {
	label: string;
	icon?: ReactNode;
	onClick: () => void;
}

export type ListNavigationListItem = ListNavigationLink | ListNavigationButton;

export interface ListNavigationProps extends DefaultComponentProps {
	listItems: ListNavigationListItem[] | ListNavigationListItem[][]; // divider between arrays
	type?: 'primary' | 'secondary';
}
