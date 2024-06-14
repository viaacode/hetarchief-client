import { FC } from 'react';

import { DefaultComponentProps } from '@shared/types';

import { DefaultFilterFormProps, InlineFilterFormProps, SearchFilterId } from '../../../types';
import { FilterMenuType, OnFilterMenuFormReset, OnFilterMenuFormSubmit } from '../FilterMenu.types';

export interface FilterFormProps extends DefaultComponentProps {
	children?: React.ReactNode;
	form: FC<DefaultFilterFormProps<any>> | FC<InlineFilterFormProps> | null;
	id: SearchFilterId;
	onFormReset: OnFilterMenuFormReset;
	onFormSubmit: OnFilterMenuFormSubmit;
	title: string;
	type: FilterMenuType;
	values?: unknown;
	disabled?: boolean;
}
