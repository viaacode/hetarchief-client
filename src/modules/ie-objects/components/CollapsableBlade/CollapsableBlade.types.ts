import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface CollapsableBladeProps extends DefaultComponentProps {
	children?: ReactNode;
	icon?: ReactNode;
	title: string | ReactNode;
	ariaLabel: string;
	renderContent: (hidden: boolean) => ReactNode;
	isOpen: boolean;
	setIsOpen: (newIsOpen: boolean) => void;
}
