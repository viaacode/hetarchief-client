import { type DefaultFilterFormProps, type Operator } from '../../types';

export type ReleaseDateFilterFormProps = DefaultFilterFormProps<ReleaseDateFilterFormState>;

export interface ReleaseDateFilterFormState {
	operator: Operator;
	releaseDate?: string;
}
