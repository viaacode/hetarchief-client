import { ReactNode } from 'react';

import { NavigationItem } from '../Navigation.types';

export interface NavigationDropdownProps {
	id: string;
	isOpen: boolean;
	items: NavigationItem[];
	trigger: ReactNode;
	lockScroll?: boolean;
	flyoutClassName?: string;
	onOpen?: (id: string) => void;
	onClose?: (id: string) => void;
}
