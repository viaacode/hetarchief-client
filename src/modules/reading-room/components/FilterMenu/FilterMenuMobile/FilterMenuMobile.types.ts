import { FilterMenuProps } from '../FilterMenu.types';

export interface FilterMenuMobileProps extends Pick<FilterMenuProps, 'filters' | 'sortOptions'> {
	activeFilter: string | null;
	isOpen: boolean;
	onClose?: () => void;
	onFilterClick?: (id: string) => void;
}
