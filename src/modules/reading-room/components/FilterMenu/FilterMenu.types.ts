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
	onSortClick?: FilterMenuOnSortClick;
	onFilterSubmit?: (values: Record<string, unknown>) => void;
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
}

export type FilterMenuOnSortClick = (key: ReadingRoomSort, order?: SortOrder) => void;
