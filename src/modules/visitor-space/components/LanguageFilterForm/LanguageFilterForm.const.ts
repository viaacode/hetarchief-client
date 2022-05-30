import { ArrayParam } from 'use-query-params';
import { array, object, SchemaOf, string } from 'yup';

import { VisitorSpaceFilterId } from '../../types';

import { LanguageFilterFormState } from './LanguageFilterForm.types';

export const LANGUAGE_FILTER_FORM_SCHEMA = (): SchemaOf<LanguageFilterFormState> =>
	object({
		languages: array(string().required()),
	});

export const LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Language]: ArrayParam,
};
