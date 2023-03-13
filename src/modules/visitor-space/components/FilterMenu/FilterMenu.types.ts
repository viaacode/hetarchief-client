import { OrderDirection } from '@meemoo/react-components';
import { FC } from 'react';

import { IconProps, ToggleOption } from '@shared/components';
import { DefaultComponentProps, SortObject } from '@shared/types';

import { DefaultFilterFormProps, TagIdentity, VisitorSpaceSort } from '../../types';

export interface FilterMenuProps extends DefaultComponentProps {
	activeSort?: SortObject;
	filters?: FilterMenuFilterOption[];
	filterValues?: Record<string, unknown>;
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
	onRemoveValue?: (tags: TagIdentity[]) => void;
	showNavigationBorder: boolean;
}

export interface FilterMenuSortOption {
	label: string;
	orderProp: VisitorSpaceSort;
	orderDirection?: OrderDirection;
}

export interface FilterMenuFilterOption {
	id: string;
	icon?: IconProps['name'];
	label: string;
	form: FC<DefaultFilterFormProps<any>> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
	isDisabled?: () => boolean;
}

export type OnFilterMenuSortClick = (key: VisitorSpaceSort, order?: OrderDirection) => void;
export type OnFilterMenuFormSubmit = <Values>(id: string, values: Values) => void;
export type OnFilterMenuFormReset = (id: string) => void;
