import { DefaultFilterFormProps } from '@reading-room/types';
import { Operator } from '@shared/types';

export type CreatedFilterFormProps = DefaultFilterFormProps<CreatedFilterFormState>;

export interface CreatedFilterFormState {
	operator: Operator;
	values: string[];
}
