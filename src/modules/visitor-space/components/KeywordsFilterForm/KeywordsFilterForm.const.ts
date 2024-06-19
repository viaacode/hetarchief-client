import { ArrayParam } from 'use-query-params';
import { array, object, type SchemaOf, string } from 'yup';

import { SearchFilterId } from '../../types';

import { type KeywordsFilterFormState } from './KeywordsFilterForm.types';

export const KEYWORDS_FILTER_FORM_SCHEMA = (): SchemaOf<KeywordsFilterFormState> =>
	object({
		values: array(string().required()),
	});

export const KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Keywords]: ArrayParam,
};
