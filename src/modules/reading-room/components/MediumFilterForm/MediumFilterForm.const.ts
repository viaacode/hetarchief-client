import { array, object, SchemaOf, string } from 'yup';

import { MediumFilterFormState } from './MediumFilterForm.types';

export const MEDIUM_FILTER_FORM_SCHEMA = (): SchemaOf<MediumFilterFormState> =>
	object({
		mediums: array(string().required()),
	});
