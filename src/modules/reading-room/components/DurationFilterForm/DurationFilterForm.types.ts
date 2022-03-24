import { DefaultFilterFormProps } from '@reading-room/types';
import { Operator } from '@shared/types';

export type DurationFilterFormProps = DefaultFilterFormProps<DurationFilterFormState>;

export interface DurationFilterFormState {
	operator: Operator;
	duration: string;
}
