import { StringParam, withDefault } from 'use-query-params';

import { ROUTES } from './routes';

export const TOS_INDEX_QUERY_PARAM_CONFIG = {
	after: withDefault(StringParam, ROUTES.home),
};
