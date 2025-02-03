import type { ReactNode } from 'react';

import type { DefaultComponentProps, SortObject } from '@shared/types';

import type { FilterMenuSortOption, OnFilterMenuSortClick } from '../FilterMenu.types';

export interface FilterSortProps extends DefaultComponentProps {
	children?: ReactNode;
	activeSort?: SortObject;
	activeSortLabel: ReactNode;
	options: FilterMenuSortOption[];
	onOptionClick?: OnFilterMenuSortClick;
}
