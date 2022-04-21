import { BooleanParam, StringParam } from 'use-query-params';

import { SEARCH_QUERY_KEY } from '@shared/const';

// Should match the key in query config below
export const SHOW_AUTH_QUERY_KEY = 'showAuth';
export const VISITOR_SPACE_ID_QUERY_KEY = 'visitorSpace';

export const HOME_QUERY_PARAM_CONFIG = {
	returnToRequestAccess: BooleanParam,
	[SEARCH_QUERY_KEY]: StringParam,
	[SHOW_AUTH_QUERY_KEY]: BooleanParam,
};
