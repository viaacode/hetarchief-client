import type { ReactNode } from 'react';

import type { TagIdentity } from '../../../types';
import type {
	FilterMenuProps,
	OnFilterMenuFormReset,
	OnFilterMenuFormSubmit,
} from '../FilterMenu.types';

export interface FilterMenuMobileProps
	extends Pick<
		FilterMenuProps,
		'activeSort' | 'filters' | 'sortOptions' | 'onSortClick' | 'filterValues'
	> {
	children?: ReactNode;
	activeFilter: string | null | undefined;
	activeSortLabel: ReactNode;
	isOpen: boolean;
	onClose?: () => void;
	onFilterClick?: (id: string) => void;
	onFilterReset: OnFilterMenuFormReset;
	onFilterSubmit: OnFilterMenuFormSubmit;
	onRemoveValue?: (removedValue: TagIdentity) => void;
}
