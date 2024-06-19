import { ArrayParam } from 'use-query-params';
import { array, object, type SchemaOf, string } from 'yup';

import { SearchFilterId } from '../../types';

import { type MediumFilterFormState } from './MediumFilterForm.types';

export const MEDIUM_FILTER_FORM_SCHEMA = (): SchemaOf<MediumFilterFormState> =>
	object({
		mediums: array(string().required()),
	});

export const MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Medium]: ArrayParam,
};
