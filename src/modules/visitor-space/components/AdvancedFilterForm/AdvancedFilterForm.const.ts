import { array, object, SchemaOf, string } from 'yup';

import { Operator } from '@shared/types';

import { AdvancedFilter, MetadataProp } from '../../types';

import { AdvancedFilterFormState } from './AdvancedFilterForm.types';

export const initialFields = (): AdvancedFilter => ({
	prop: MetadataProp.Everything,
	op: Operator.Contains,
	val: '',
});

export const ADVANCED_FILTER_FORM_SCHEMA = (): SchemaOf<AdvancedFilterFormState> =>
	object({
		advanced: array(
			object({
				prop: string(),
				op: string(),
				val: string(),
			})
		),
	});
