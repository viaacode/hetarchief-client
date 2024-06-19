import { ArrayParam } from 'use-query-params';
import { array, object, type SchemaOf, string } from 'yup';

import { SearchFilterId } from '../../types';

import { type LanguageFilterFormState } from './LanguageFilterForm.types';

export const LANGUAGE_FILTER_FORM_SCHEMA = (): SchemaOf<LanguageFilterFormState> =>
	object({
		languages: array(string().required()),
	});

export const LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Language]: ArrayParam,
};
