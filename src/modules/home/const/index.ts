import { BooleanParam, StringParam } from 'use-query-params';

import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';

export const HOME_QUERY_PARAM_CONFIG = {
	returnToRequestAccess: BooleanParam,
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: StringParam,
	[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: BooleanParam,
};
