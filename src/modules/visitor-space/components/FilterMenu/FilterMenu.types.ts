import type { IconName } from '@shared/components/Icon';
import type { ToggleOption } from '@shared/components/Toggle';
import type { DefaultComponentProps, SortObject } from '@shared/types';
import type { IeObjectsSearchFilterField, SearchPageMediaType } from '@shared/types/ie-objects';
import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import type { FC, ReactNode } from 'react';
import type {
	DefaultFilterFormProps,
	FilterModalType,
	FilterProperty,
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
	/** The list the advanced fly-out shows: every filter of this tab that opens a modal. */
	flyoutFilters?: FilterMenuFilterOption[];
	onFlyoutFilterClick?: (filterId: SearchFilterId) => void;
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
	orderDirection?: AvoSearchOrderDirection;
}

export enum FilterMenuType {
	Modal = 0,
	Checkbox = 1,
}

export interface FilterMenuFilterOption {
	id: SearchFilterId;
	icon?: IconName;
	label: string;
	/**
	 * A form component of its own. Leave it out for the four generic modal types of ARC-3806;
	 * FilterForm then picks the generic form that belongs to `modalType`.
	 */
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	form?: FC<DefaultFilterFormProps<any>> | FC<InlineFilterFormProps<any>> | FC<any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
	type: FilterMenuType;
	modalType: FilterModalType;
	/** The elasticsearch field this filter queries. Drives its option list and its query clauses. */
	field?: IeObjectsSearchFilterField;
	/** Only for the date and duration filters, which keep their operator dropdown. */
	property?: FilterProperty;
	/** A fixed value list, for a filter whose options do not come from an aggregation. */
	options?: () => { label: string; value: string }[];
	/** Does this filter sit in the filter panel before the user picks it from the advanced fly-out? */
	inMainPanelByDefault: boolean;
	isDisabled?: () => boolean;
	tabs: SearchPageMediaType[];
}

export type OnFilterMenuSortClick = (key: SearchSortProp, order?: AvoSearchOrderDirection) => void;
export type OnFilterMenuFormSubmit = <Values>(id: SearchFilterId, values: Values) => void;
export type OnFilterMenuFormReset = (id: SearchFilterId) => void;

export enum AutocompleteField {
	creator = 'creator',
	locationCreated = 'locationCreated',
	newspaperSeriesName = 'newspaperSeriesName',
	mentions = 'mentions',
}
