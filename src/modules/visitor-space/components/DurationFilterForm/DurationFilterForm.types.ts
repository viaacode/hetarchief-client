import { Operator } from '@shared/types';

import { DefaultFilterFormProps } from '../../types';

export type DurationFilterFormProps = DefaultFilterFormProps<DurationFilterFormState>;

export interface DurationFilterFormState {
	operator: Operator;
	duration?: string;
}
