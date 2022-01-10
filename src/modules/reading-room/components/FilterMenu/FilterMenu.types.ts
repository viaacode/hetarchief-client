import { IconProps } from '@shared/components';
import { DefaultComponentProps, SortOrder } from '@shared/types';

export interface FilterMenuProps extends DefaultComponentProps {
	activeSort?: FilterMenuSortOption;
	filters?: FilterMenuFilterOption[];
	label?: string;
	isOpen?: boolean;
	sortOptions?: FilterMenuSortOption[];
	onMenuToggle?: () => void;
	onSortClick?: FilterMenuOnSortClick;
	onFilterSubmit?: (values: Record<string, unknown>) => void;
	onViewToggle?: (viewType: string) => void;
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
