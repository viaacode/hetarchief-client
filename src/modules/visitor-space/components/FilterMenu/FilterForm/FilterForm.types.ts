import type { FC, ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

import type { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import type { DefaultFilterFormProps, FilterValue } from '../../../types';
import type {
	FilterMenuType,
	OnFilterMenuFormReset,
	OnFilterMenuFormSubmit,
} from '../FilterMenu.types';

export interface FilterFormProps extends DefaultComponentProps {
	children?: ReactNode;
	form: FC<DefaultFilterFormProps> | null;
	id: IeObjectsSearchFilterField;
	onFormReset: OnFilterMenuFormReset;
	onFormSubmit: OnFilterMenuFormSubmit;
	title: string;
	type: FilterMenuType;
	initialValues?: FilterValue[];
	disabled?: boolean;
}
