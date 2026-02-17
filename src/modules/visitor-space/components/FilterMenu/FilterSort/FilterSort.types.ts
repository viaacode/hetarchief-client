import type { DefaultComponentProps, SortObject } from '@shared/types';
import type { ReactNode } from 'react';

import type { FilterMenuSortOption, OnFilterMenuSortClick } from '../FilterMenu.types';

export interface FilterSortProps extends DefaultComponentProps {
	children?: ReactNode;
	activeSort?: SortObject;
	activeSortLabel: ReactNode;
	activeSortAriaLabel: string;
	options: FilterMenuSortOption[];
	onOptionClick?: OnFilterMenuSortClick;
	id: string;
}
