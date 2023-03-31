import { FC } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { DefaultFilterFormProps, InlineFilterFormProps } from '../../../types';
import { FilterMenuType, OnFilterMenuFormReset, OnFilterMenuFormSubmit } from '../FilterMenu.types';

export interface FilterFormProps extends DefaultComponentProps {
	form: FC<DefaultFilterFormProps> | FC<InlineFilterFormProps> | null;
	id: string;
	onFormReset: OnFilterMenuFormReset;
	onFormSubmit: OnFilterMenuFormSubmit;
	title: string;
	type: FilterMenuType;
	values?: unknown;
	disabled?: boolean;
}
