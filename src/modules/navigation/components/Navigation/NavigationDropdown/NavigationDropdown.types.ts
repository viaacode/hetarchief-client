import type { Placement } from '@floating-ui/react';
import type { NavigationItem } from '@navigation/components/Navigation/NavigationSection/NavigationSection.types';
import type { ReactNode } from 'react';

export interface NavigationDropdownProps {
	children?: ReactNode;
	id: string;
	isOpen: boolean;
	items?: NavigationItem[];
	renderedItems?: ReactNode;
	trigger: ReactNode;
	lockScroll?: boolean;
	className?: string;
	flyoutClassName?: string;
	placement?: Placement;
	onOpen?: (id: string) => void;
	onClose?: (id?: string) => void;
}
