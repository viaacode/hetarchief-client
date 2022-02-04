import { stringify } from 'query-string';
import { BooleanParam, encodeQueryParams } from 'use-query-params';

import { SHOW_AUTH_QUERY_KEY } from '@home/const';

export const encodeShowAuth = (value: boolean): string => {
	const encodedShowAuth = encodeQueryParams(
		{ [SHOW_AUTH_QUERY_KEY]: BooleanParam },
		{ [SHOW_AUTH_QUERY_KEY]: value }
	);

	return stringify(encodedShowAuth);
};
