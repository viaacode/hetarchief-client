import type { DefaultFilterFormProps, Operator } from '../../types';

export type ReleaseDateFilterFormProps = DefaultFilterFormProps<ReleaseDateFilterFormState>;

export interface ReleaseDateFilterFormState {
	operator: Operator;
	releaseDate?: string;
}
