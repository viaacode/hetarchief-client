import { type Operator } from '@shared/types';

import { type DefaultFilterFormProps } from '../../types';

export type CreatedFilterFormProps = DefaultFilterFormProps<CreatedFilterFormState>;

export interface CreatedFilterFormState {
	operator: Operator;
	created?: string;
}
