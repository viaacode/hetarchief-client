import type { FC, ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

import type { DefaultFilterFormProps, InlineFilterFormProps, SearchFilterId } from '../../../types';
import type { FilterMenuType, OnFilterMenuFormReset, OnFilterMenuFormSubmit } from '../FilterMenu.types';

export interface FilterFormProps extends DefaultComponentProps {
	children?: ReactNode;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	form: FC<DefaultFilterFormProps<any>> | FC<InlineFilterFormProps> | null;
	id: SearchFilterId;
	onFormReset: OnFilterMenuFormReset;
	onFormSubmit: OnFilterMenuFormSubmit;
	title: string;
	type: FilterMenuType;
	values?: unknown;
	disabled?: boolean;
}
