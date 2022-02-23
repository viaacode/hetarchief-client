import { StringParam, withDefault } from 'use-query-params';

import { ROUTES } from './routes';

export const REDIRECT_TO_QUERY_KEY = 'redirectTo';

export const TOS_INDEX_QUERY_PARAM_CONFIG = {
	[REDIRECT_TO_QUERY_KEY]: withDefault(StringParam, ROUTES.home),
};
