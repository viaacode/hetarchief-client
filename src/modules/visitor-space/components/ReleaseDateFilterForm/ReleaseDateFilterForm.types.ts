import type { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import type { DefaultFilterFormProps } from '../../types';

export type ReleaseDateFilterFormProps = DefaultFilterFormProps<ReleaseDateFilterFormState>;

export interface ReleaseDateFilterFormState {
	operator: IeObjectsSearchOperator;
	releaseDate?: string;
}
