import { Operator } from '@shared/types';

import { DefaultFilterFormProps } from '../../types';

export type CreatedFilterFormProps = DefaultFilterFormProps<CreatedFilterFormState>;

export interface CreatedFilterFormState {
	operator: Operator;
	created?: string;
}
