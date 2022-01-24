import { IconProps, ToggleOption } from '@shared/components';
import { DefaultComponentProps, SortOrder } from '@shared/types';

export interface FilterMenuProps extends DefaultComponentProps {
	activeSort?: FilterMenuSortOption;
	filters?: FilterMenuFilterOption[];
	label?: string;
	isOpen?: boolean;
	isMobileOpen?: boolean;
	sortOptions?: FilterMenuSortOption[];
	toggleOptions?: ToggleOption[];
	onMenuToggle?: (nextOpen?: boolean) => void;
	onSortClick?: FilterMenuOnSortClick;
	onFilterSubmit?: (values: Record<string, unknown>) => void;
	onViewToggle?: (viewMode: string) => void;
}

export interface FilterMenuSortOption {
	label: string;
	order?: SortOrder;
	onClick?: FilterMenuOnSortClick;
}

export interface FilterMenuFilterOption {
	id: string;
	icon?: IconProps['name'];
	label: string;
	onClick?: FilterMenuOnSortClick;
}

export type FilterMenuOnSortClick = (key: string, order?: SortOrder) => void;
