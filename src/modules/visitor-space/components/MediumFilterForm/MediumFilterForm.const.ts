import { ArrayParam } from 'use-query-params';
import { array, object, SchemaOf, string } from 'yup';

import { VisitorSpaceFilterId } from '../../types';

import { MediumFilterFormState } from './MediumFilterForm.types';

export const MEDIUM_FILTER_FORM_SCHEMA = (): SchemaOf<MediumFilterFormState> =>
	object({
		mediums: array(string().required()),
	});

export const MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Medium]: ArrayParam,
};
