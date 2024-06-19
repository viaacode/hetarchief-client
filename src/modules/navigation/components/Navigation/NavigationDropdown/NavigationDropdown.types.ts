import { type ReactNode } from 'react';

import { type NavigationItem } from '@navigation/components/Navigation/NavigationSection/NavigationSection.types';

export interface NavigationDropdownProps {
	children?: ReactNode;
	id: string;
	isOpen: boolean;
	items: NavigationItem[];
	trigger: ReactNode;
	lockScroll?: boolean;
	className?: string;
	flyoutClassName?: string;
	onOpen?: (id: string) => void;
	onClose?: (id?: string) => void;
}
