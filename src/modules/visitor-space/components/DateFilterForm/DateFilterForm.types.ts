import type { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import type { GenericFilterFormProps } from '../../types';

export type DateFilterFormProps = GenericFilterFormProps;

export interface DateFilterFormState {
	operator: IeObjectsSearchOperator;
	date?: string;
}
