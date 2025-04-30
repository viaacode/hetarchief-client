import { type AdvancedFilter, FilterProperty, Operator } from '../../types';

export const initialFields = (): AdvancedFilter => ({
	prop: FilterProperty.TITLE,
	op: Operator.CONTAINS,
	val: '',
});
