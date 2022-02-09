import { ReactElement } from 'react';

import { ReadingRoomSort } from '@reading-room/types';
import { IconProps, ToggleOption } from '@shared/components';
import { DefaultComponentProps, SortObject, SortOrder } from '@shared/types';

export interface FilterMenuProps extends DefaultComponentProps {
	activeSort?: SortObject;
	filters?: FilterMenuFilterOption[];
	label?: string;
	isOpen?: boolean;
	isMobileOpen?: boolean;
	sortOptions?: FilterMenuSortOption[];
	toggleOptions?: ToggleOption[];
	onMenuToggle?: (nextOpen?: boolean, isMobile?: boolean) => void;
	onSortClick?: OnFilterMenuSortClick;
	onFilterReset?: OnFilterMenuFormReset;
	onFilterSubmit?: OnFilterMenuFormSubmit;
	onViewToggle?: (viewMode: string) => void;
}

export interface FilterMenuSortOption {
	label: string;
	sort: ReadingRoomSort;
	order?: SortOrder;
}

export interface FilterMenuFilterOption {
	id: string;
	icon?: IconProps['name'];
	label: string;
	form?: () => ReactElement | null; // TODO make form not optional
}

export type OnFilterMenuSortClick = (key: ReadingRoomSort, order?: SortOrder) => void;
export type OnFilterMenuFormSubmit = <Values>(id: string, values: Values) => void;
export type OnFilterMenuFormReset = (id: string) => void;
