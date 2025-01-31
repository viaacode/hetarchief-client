import type { OrderDirection } from '@meemoo/react-components';
import type { FC, ReactNode } from 'react';

import type { IconName } from '@shared/components/Icon';
import type { ToggleOption } from '@shared/components/Toggle';
import type { DefaultComponentProps, SortObject } from '@shared/types';
import type { SearchPageMediaType } from '@shared/types/ie-objects';

import type {
	DefaultFilterFormProps,
	InlineFilterFormProps,
	SearchFilterId,
	SearchSortProp,
	TagIdentity,
} from '../../types';

export interface FilterMenuProps extends DefaultComponentProps {
	children?: ReactNode;
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
}

export interface FilterMenuSortOption {
	label: string;
	orderProp: SearchSortProp;
	orderDirection?: OrderDirection;
}

export enum FilterMenuType {
	Modal = 0,
	Checkbox = 1,
}

export interface FilterMenuFilterOption {
	id: SearchFilterId;
	icon?: IconName;
	label: string;
	form: FC<DefaultFilterFormProps<any>> | FC<InlineFilterFormProps<any>> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
	type: FilterMenuType;
	isDisabled?: () => boolean;
	tabs: SearchPageMediaType[];
}

export type OnFilterMenuSortClick = (key: SearchSortProp, order?: OrderDirection) => void;
export type OnFilterMenuFormSubmit = <Values>(id: SearchFilterId, values: Values) => void;
export type OnFilterMenuFormReset = (id: SearchFilterId) => void;

export enum AutocompleteField {
	creator = 'creator',
	locationCreated = 'locationCreated',
	newspaperSeriesName = 'newspaperSeriesName',
	mentions = 'mentions',
}
