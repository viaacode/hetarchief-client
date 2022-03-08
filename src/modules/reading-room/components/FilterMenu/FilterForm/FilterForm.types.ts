import { FC } from 'react';

import { DefaultFilterFormProps } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

import { OnFilterMenuFormReset, OnFilterMenuFormSubmit } from '../FilterMenu.types';

export interface FilterFormProps extends DefaultComponentProps {
	form: FC<DefaultFilterFormProps> | null;
	id: string;
	title: string;
	values?: unknown;
	onFormSubmit: OnFilterMenuFormSubmit;
	onFormReset: OnFilterMenuFormReset;
}
