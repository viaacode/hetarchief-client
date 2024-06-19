import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

import {
	type FilterMenuFilterOption,
	type OnFilterMenuFormReset,
	type OnFilterMenuFormSubmit,
} from '../FilterMenu.types';

export interface FilterOptionProps extends DefaultComponentProps, FilterMenuFilterOption {
	children?: ReactNode;
	activeFilter: string | null | undefined;
	values?: unknown;
	onClick?: (filterId: string) => void;
	onFormSubmit: OnFilterMenuFormSubmit;
	onFormReset: OnFilterMenuFormReset;
}
