import type { FC, ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

import type {
	DefaultFilterArrayFormProps,
	DefaultFilterFormProps,
	FilterValue,
	SearchFilterId,
} from '../../../types';
import type {
	FilterMenuType,
	OnFilterMenuFormReset,
	OnFilterMenuFormSubmit,
} from '../FilterMenu.types';

export interface FilterFormProps extends DefaultComponentProps {
	children?: ReactNode;
	form: FC<DefaultFilterFormProps> | FC<DefaultFilterArrayFormProps> | null;
	id: SearchFilterId;
	onFormReset: OnFilterMenuFormReset;
	onFormSubmit: OnFilterMenuFormSubmit;
	title: string;
	type: FilterMenuType;
	initialValue?: FilterValue;
	disabled?: boolean;
}
