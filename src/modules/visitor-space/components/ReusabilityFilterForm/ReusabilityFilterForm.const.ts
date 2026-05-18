import { tText } from '@shared/helpers/translate';
import { ArrayParam } from 'use-query-params';

import { ReusabilityFilterOption, SearchFilterId } from '../../types';

export const REUSABILITY_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Reusability]: ArrayParam,
};

export const REUSABILITY_OPTIONS = () => [
	{
		key: ReusabilityFilterOption.FREELY_REUSABLE,
		label: tText('modules/visitor-space/components/reusability-filter-form___vrij-herbruikbaar'),
	},
	{
		key: ReusabilityFilterOption.REUSABLE_WITH_CONDITIONS,
		label: tText(
			'modules/visitor-space/components/reusability-filter-form___herbruikbaar-onder-voorwaarden'
		),
	},
	{
		key: ReusabilityFilterOption.POSSIBLY_REUSABLE,
		label: tText(
			'modules/visitor-space/components/reusability-filter-form___misschien-herbruikbaar'
		),
	},
];
