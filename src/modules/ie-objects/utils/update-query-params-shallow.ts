import type { NextRouter } from 'next/router';
import { parseUrl, type StringifiableRecord, stringifyUrl } from 'query-string';

type QueryParamValue = string | number | boolean | undefined;

// Query params of updates that are still waiting for their route change to finish
let pendingQuery: StringifiableRecord | null = null;

/**
 * Shallow router.replace that sets/removes (undefined) the given query params.
 *
 * window.location only changes once the route change finishes, so several updates in the same tick
 * would each start from the same stale url and the last one to finish would drop the params of the
 * others. Updates that are still pending are merged into the next one instead.
 */
export const updateQueryParamsShallow = async (
	router: Pick<NextRouter, 'replace'>,
	params: Record<string, QueryParamValue>
): Promise<void> => {
	const parsedUrl = parseUrl(window.location.href);
	const query = { ...(pendingQuery ?? parsedUrl.query), ...params };
	for (const key of Object.keys(params)) {
		if (params[key] === undefined) {
			delete query[key];
		}
	}
	pendingQuery = query;

	try {
		await router.replace(stringifyUrl({ url: parsedUrl.url, query }), undefined, {
			shallow: true,
		});
	} catch {
		// A newer navigation cancelled this route change, which carries these params too
	} finally {
		if (pendingQuery === query) {
			pendingQuery = null;
		}
	}
};
