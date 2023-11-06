import { ReactNode } from 'react';

import { DefaultComponentProps, SortObject } from '@shared/types';

import { FilterMenuSortOption, OnFilterMenuSortClick } from '../FilterMenu.types';

export interface FilterSortProps extends DefaultComponentProps {
	children?: React.ReactNode;
	activeSort?: SortObject;
	activeSortLabel: ReactNode;
	options: FilterMenuSortOption[];
	onOptionClick?: OnFilterMenuSortClick;
}
