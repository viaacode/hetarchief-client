import { ReactNode } from 'react';

import { TagIdentity } from '@reading-room/types';

import { OnFilterMenuFormReset, OnFilterMenuFormSubmit } from '..';
import { FilterMenuProps } from '../FilterMenu.types';

export interface FilterMenuMobileProps
	extends Pick<
		FilterMenuProps,
		'activeSort' | 'filters' | 'sortOptions' | 'onSortClick' | 'filterValues'
	> {
	activeFilter: string | null | undefined;
	activeSortLabel: ReactNode;
	isOpen: boolean;
	onClose?: () => void;
	onFilterClick?: (id: string) => void;
	onFilterReset: OnFilterMenuFormReset;
	onFilterSubmit: OnFilterMenuFormSubmit;
	onRemoveValue?: (removedValue: TagIdentity[]) => void;
	showNavigationBorder: boolean;
}
