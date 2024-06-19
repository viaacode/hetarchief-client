import { type FC, type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

import {
	type DefaultFilterFormProps,
	type InlineFilterFormProps,
	type SearchFilterId,
} from '../../../types';
import {
	type FilterMenuType,
	type OnFilterMenuFormReset,
	type OnFilterMenuFormSubmit,
} from '../FilterMenu.types';

export interface FilterFormProps extends DefaultComponentProps {
	children?: ReactNode;
	form: FC<DefaultFilterFormProps<any>> | FC<InlineFilterFormProps> | null;
	id: SearchFilterId;
	onFormReset: OnFilterMenuFormReset;
	onFormSubmit: OnFilterMenuFormSubmit;
	title: string;
	type: FilterMenuType;
	values?: unknown;
	disabled?: boolean;
}
