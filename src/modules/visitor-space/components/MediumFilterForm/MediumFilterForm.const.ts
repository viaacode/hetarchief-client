import { ArrayParam } from 'use-query-params';
import { type Schema, array, object, string } from 'yup';

import { SearchFilterId } from '../../types';

import { tText } from '@shared/helpers/translate';
import type { MediumFilterFormState } from './MediumFilterForm.types';

export const MEDIUM_FILTER_FORM_SCHEMA = (): Schema<MediumFilterFormState> =>
	object({
		mediums: array(
			string().required(
				tText(
					'modules/visitor-space/components/medium-filter-form/medium-filter-form___fysieke-drager-is-een-verplicht-veld'
				)
			)
		).required(
			tText(
				'modules/visitor-space/components/medium-filter-form/medium-filter-form___fysieke-drager-is-een-verplicht-veld'
			)
		),
	});

export const MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Medium]: ArrayParam,
};
