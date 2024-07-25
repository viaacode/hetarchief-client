import { ArrayParam } from 'use-query-params';
import { array, object, type Schema, string } from 'yup';

import { SearchFilterId } from '../../types';

import { type MediumFilterFormState } from './MediumFilterForm.types';

export const MEDIUM_FILTER_FORM_SCHEMA = (): Schema<MediumFilterFormState> =>
	object({
		mediums: array(string().required()).required(),
	});

export const MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Medium]: ArrayParam,
};
