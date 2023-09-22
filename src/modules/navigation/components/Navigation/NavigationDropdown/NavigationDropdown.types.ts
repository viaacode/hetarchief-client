import { ReactNode } from 'react';

import { NavigationItem } from '../Navigation.types';

export interface NavigationDropdownProps {
	children?: React.ReactNode;
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
