import { type Operator } from '@shared/types';

import { type DefaultFilterFormProps } from '../../types';

export type ReleaseDateFilterFormProps = DefaultFilterFormProps<ReleaseDateFilterFormState>;

export interface ReleaseDateFilterFormState {
	operator: Operator;
	releaseDate?: string;
}
