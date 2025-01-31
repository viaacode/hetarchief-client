import type { DefaultFilterFormProps, Operator } from '../../types';

export type DurationFilterFormProps = DefaultFilterFormProps<DurationFilterFormState>;

export interface DurationFilterFormState {
	operator: Operator;
	duration?: string;
}
