import { ArrayParam } from 'use-query-params';
import { type Schema, array, object, string } from 'yup';

import { SearchFilterId } from '../../types';

import { tText } from '@shared/helpers/translate';
import type { KeywordsFilterFormState } from './KeywordsFilterForm.types';

export const KEYWORDS_FILTER_FORM_SCHEMA = (): Schema<KeywordsFilterFormState> =>
	object({
		values: array(
			string().required(
				tText(
					'modules/visitor-space/components/keywords-filter-form/keywords-filter-form___trefwoord-is-een-verplicht-veld'
				)
			)
		).required(
			tText(
				'modules/visitor-space/components/keywords-filter-form/keywords-filter-form___trefwoord-is-een-verplicht-veld'
			)
		),
	});

export const KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Keywords]: ArrayParam,
};
