import { DefaultComponentProps, SortObject } from '@shared/types';

import { FilterMenuOnSortClick, FilterMenuSortOption } from '../FilterMenu.types';

export interface FilterSortListProps extends DefaultComponentProps {
	activeSort?: SortObject;
	options: FilterMenuSortOption[];
	onOptionClick?: FilterMenuOnSortClick;
}
