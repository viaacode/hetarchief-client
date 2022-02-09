import { ReactNode } from 'react';

import { FilterMenuProps } from '../FilterMenu.types';

export interface FilterMenuMobileProps
	extends Pick<FilterMenuProps, 'activeSort' | 'filters' | 'sortOptions' | 'onSortClick'> {
	activeFilter: string | null;
	activeSortLabel: ReactNode;
	isOpen: boolean;
	onClose?: () => void;
	onFilterClick?: (id: string) => void;
}
