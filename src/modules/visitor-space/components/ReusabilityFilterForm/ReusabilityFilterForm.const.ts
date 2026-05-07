import { tText } from '@shared/helpers/translate';
import { ArrayParam } from 'use-query-params';

import { SearchFilterId } from '../../types';

export const REUSABILITY_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Reusability]: ArrayParam,
};

export const REUSABILITY_OPTIONS = () => [
	{
		key: 'freely-reusable',
		label: tText('modules/visitor-space/components/reusability-filter-form___vrij-herbruikbaar'),
	},
	{
		key: 'reusable-with-conditions',
		label: tText(
			'modules/visitor-space/components/reusability-filter-form___herbruikbaar-onder-voorwaarden'
		),
	},
	{
		key: 'possibly-reusable',
		label: tText(
			'modules/visitor-space/components/reusability-filter-form___misschien-herbruikbaar'
		),
	},
];
