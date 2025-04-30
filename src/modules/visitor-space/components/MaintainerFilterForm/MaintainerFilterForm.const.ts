import { ArrayParam } from 'use-query-params';
import { type Schema, array, object, string } from 'yup';

import { SearchFilterId } from '../../types';

import { tText } from '@shared/helpers/translate';
import type { MaintainerFilterFormState } from './MaintainerFilterForm.types';

export const MAINTAINER_FILTER_FORM_SCHEMA = (): Schema<MaintainerFilterFormState> =>
	object({
		maintainers: array(
			string().required(
				tText(
					'modules/visitor-space/components/maintainer-filter-form/maintainer-filter-form___aanbieder-is-een-verplicht-veld'
				)
			)
		).required(
			tText(
				'modules/visitor-space/components/maintainer-filter-form/maintainer-filter-form___aanbieder-is-een-verplicht-veld'
			)
		),
	});

export const MAINTAINER_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Maintainers]: ArrayParam,
};
