import { array, object, type Schema, string } from 'yup';

import { type AdvancedFilter, FilterProperty, Operator } from '../../types';

import { type AdvancedFilterFormState } from './AdvancedFilterForm.types';

export const initialFields = (): AdvancedFilter => ({
	prop: FilterProperty.EVERYTHING,
	op: Operator.CONTAINS,
	val: '',
});

export const ADVANCED_FILTER_FORM_SCHEMA = (): Schema<AdvancedFilterFormState> =>
	object({
		advanced: array(
			object({
				prop: string(),
				op: string(),
				val: string(),
			})
		).required(),
	});
