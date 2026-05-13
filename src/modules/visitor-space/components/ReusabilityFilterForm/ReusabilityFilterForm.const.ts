import { tText } from '@shared/helpers/translate';
import { ArrayParam } from 'use-query-params';

import { SearchFilterId } from '../../types';

export const REUSABILITY_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Reusability]: ArrayParam,
};

export const REUSABILITY_OPTIONS = () => [
	{
		key: 'vrij-herbruikbaar',
		label: tText('modules/visitor-space/components/reusability-filter-form___vrij-herbruikbaar'),
	},
	{
		key: 'herbruikbaar-onder-voorwaarden',
		label: tText(
			'modules/visitor-space/components/reusability-filter-form___herbruikbaar-onder-voorwaarden'
		),
	},
	{
		key: 'misschien-herbruikbaar',
		label: tText(
			'modules/visitor-space/components/reusability-filter-form___misschien-herbruikbaar'
		),
	},
];
