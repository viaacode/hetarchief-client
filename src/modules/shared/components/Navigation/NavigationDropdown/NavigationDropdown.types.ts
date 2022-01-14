import { ReactNode } from 'react';

import { NavigationDropdownItem } from '../Navigation.types';

export interface NavigationDropdownProps {
	id: string;
	isOpen: boolean;
	items: NavigationDropdownItem[][];
	trigger: ReactNode;
	lockScroll?: boolean;
	flyoutClassName?: string;
	onOpen?: (id: string) => void;
	onClose?: (id: string) => void;
}
