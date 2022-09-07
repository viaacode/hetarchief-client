import { FC } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { DefaultFilterFormProps } from '../../../types';
import { OnFilterMenuFormReset, OnFilterMenuFormSubmit } from '../FilterMenu.types';

export interface FilterFormProps extends DefaultComponentProps {
	disabled?: boolean;
	form: FC<DefaultFilterFormProps> | null;
	id: string;
	onFormReset: OnFilterMenuFormReset;
	onFormSubmit: OnFilterMenuFormSubmit;
	title: string;
	values?: unknown;
}
