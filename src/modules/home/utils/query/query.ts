import { stringify } from 'query-string';
import { encodeQueryParams } from 'use-query-params';

import { HOME_QUERY_PARAM_CONFIG, SHOW_AUTH_QUERY_KEY } from '@home/const';

export const encodeShowAuth = (value: boolean): string => {
	const encodedShowAuth = encodeQueryParams(
		{ [SHOW_AUTH_QUERY_KEY]: HOME_QUERY_PARAM_CONFIG[SHOW_AUTH_QUERY_KEY] },
		{ [SHOW_AUTH_QUERY_KEY]: value }
	);

	return stringify(encodedShowAuth);
};
