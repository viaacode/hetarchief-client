import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

export interface CollapsableBladeProps extends DefaultComponentProps {
	children?: ReactNode;
	icon?: ReactNode;
	title: string | ReactNode;
	renderContent: (hidden: boolean) => ReactNode;
	isOpen: boolean;
	setIsOpen: (newIsOpen: boolean) => void;
}
