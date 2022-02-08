import { BooleanParam, StringParam } from 'use-query-params';

// Should match the key in query config below
export const SHOW_AUTH_QUERY_KEY = 'showAuth';

export const HOME_QUERY_PARAM_CONFIG = {
	returnToRequestAccess: BooleanParam,
	search: StringParam,
	[SHOW_AUTH_QUERY_KEY]: BooleanParam,
};
