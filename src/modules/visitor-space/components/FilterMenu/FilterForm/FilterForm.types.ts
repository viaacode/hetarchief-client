import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

import type {
	FilterMenuFilterOption,
	OnFilterMenuFormReset,
	OnFilterMenuFormSubmit,
} from '../FilterMenu.types';

export interface FilterFormProps extends DefaultComponentProps {
	children?: ReactNode;
	filter: FilterMenuFilterOption;
	onFormReset: OnFilterMenuFormReset;
	onFormSubmit: OnFilterMenuFormSubmit;
	title: string;
	values?: unknown;
	disabled?: boolean;
}
