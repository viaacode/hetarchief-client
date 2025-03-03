import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';
import type {
	FilterMenuFilterOption,
	OnFilterMenuFormReset,
	OnFilterMenuFormSubmit,
} from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { FilterValue } from '@visitor-space/types';

export interface FilterOptionProps extends DefaultComponentProps, FilterMenuFilterOption {
	children?: ReactNode;
	activeFilter: string | null | undefined;
	initialValue?: FilterValue[];
	onClick?: (filterId: string) => void;
	onFormSubmit: OnFilterMenuFormSubmit;
	onFormReset: OnFilterMenuFormReset;
}
