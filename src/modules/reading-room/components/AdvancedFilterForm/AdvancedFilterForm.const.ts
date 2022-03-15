import { array, object, SchemaOf, string } from 'yup';

import { AdvancedFilterFormState } from './AdvancedFilterForm.types';

export const ADVANCED_FILTER_FORM_SCHEMA = (): SchemaOf<AdvancedFilterFormState> =>
	object({
		advanced: array(
			object({
				metadataProp: string(),
				operator: string(),
				value: string(),
			})
		),
	});
