import { ArrayParam } from 'use-query-params';
import { array, object, SchemaOf, string } from 'yup';

import { VisitorSpaceFilterId } from '../../types';

import { KeywordsFilterFormState } from './KeywordsFilterForm.types';

export const KEYWORDS_FILTER_FORM_SCHEMA = (): SchemaOf<KeywordsFilterFormState> =>
	object({
		values: array(string().required()),
	});

export const KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Keywords]: ArrayParam,
};
