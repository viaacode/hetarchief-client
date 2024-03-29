import { DefaultComponentProps, SortObject } from '@shared/types';

import { FilterMenuSortOption, OnFilterMenuSortClick } from '../FilterMenu.types';

export interface FilterSortListProps extends DefaultComponentProps {
	children?: React.ReactNode;
	activeSort?: SortObject;
	options: FilterMenuSortOption[];
	onOptionClick?: OnFilterMenuSortClick;
}
