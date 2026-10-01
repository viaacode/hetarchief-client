import type { DefaultComponentProps } from '@shared/types';
import type { SearchFilterId } from '@visitor-space/types';
import type { ReactNode } from 'react';

import type {
	FilterMenuFilterOption,
	OnFilterMenuFormReset,
	OnFilterMenuFormSubmit,
} from '../FilterMenu.types';

export interface FilterOptionProps extends DefaultComponentProps {
	children?: ReactNode;
	filter: FilterMenuFilterOption;
	activeFilter: string | null | undefined;
	values?: unknown;
	onClick?: (filterId: SearchFilterId) => void;
	onFormSubmit: OnFilterMenuFormSubmit;
	onFormReset: OnFilterMenuFormReset;
	/** Only for the advanced entry: the list its fly-out shows. */
	flyoutFilters?: FilterMenuFilterOption[];
	onFlyoutFilterClick?: (filterId: SearchFilterId) => void;
}
