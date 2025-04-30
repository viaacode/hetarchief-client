import { ArrayParam } from 'use-query-params';
import { type Schema, array, object, string } from 'yup';

import { SearchFilterId } from '../../types';

import { tText } from '@shared/helpers/translate';
import type { LanguageFilterFormState } from './LanguageFilterForm.types';

export const LANGUAGE_FILTER_FORM_SCHEMA = (): Schema<LanguageFilterFormState> =>
	object({
		languages: array(
			string().required(
				tText(
					'modules/visitor-space/components/language-filter-form/language-filter-form___taal-is-een-verplicht-veld'
				)
			)
		).required(
			tText(
				'modules/visitor-space/components/language-filter-form/language-filter-form___taal-is-een-verplicht-veld'
			)
		),
	});

export const LANGUAGE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Language]: ArrayParam,
};
