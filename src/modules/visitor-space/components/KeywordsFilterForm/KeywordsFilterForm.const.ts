import { ArrayParam } from 'use-query-params';
import { array, object, type Schema, string } from 'yup';

import { SearchFilterId } from '../../types';

import { type KeywordsFilterFormState } from './KeywordsFilterForm.types';

export const KEYWORDS_FILTER_FORM_SCHEMA = (): Schema<KeywordsFilterFormState> =>
	object({
		values: array(string().required()).required(),
	});

export const KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Keywords]: ArrayParam,
};
