import { type Operator } from '@shared/types';

import { type DefaultFilterFormProps } from '../../types';

export type DurationFilterFormProps = DefaultFilterFormProps<DurationFilterFormState>;

export interface DurationFilterFormState {
	operator: Operator;
	duration?: string;
}
