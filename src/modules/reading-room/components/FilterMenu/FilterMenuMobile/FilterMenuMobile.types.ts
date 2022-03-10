import { ReactNode } from 'react';

import { OnFilterMenuFormReset, OnFilterMenuFormSubmit } from '..';
import { FilterMenuProps } from '../FilterMenu.types';

export interface FilterMenuMobileProps
	extends Pick<FilterMenuProps, 'activeSort' | 'filters' | 'sortOptions' | 'onSortClick'> {
	activeFilter: string | null;
	activeSortLabel: ReactNode;
	isOpen: boolean;
	onClose?: () => void;
	onFilterClick?: (id: string) => void;
	onFilterReset: OnFilterMenuFormReset;
	onFilterSubmit: OnFilterMenuFormSubmit;
	showNavigationBorder: boolean;
}
