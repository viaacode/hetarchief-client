import type { ReactNode } from 'react';

import type { DefaultComponentProps, SortObject } from '@shared/types';

import type { FilterMenuSortOption, OnFilterMenuSortClick } from '../FilterMenu.types';

export interface FilterSortListProps extends DefaultComponentProps {
	children?: ReactNode;
	activeSort?: SortObject;
	options: FilterMenuSortOption[];
	onOptionClick?: OnFilterMenuSortClick;
}
