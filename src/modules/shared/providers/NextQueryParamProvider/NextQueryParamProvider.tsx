/**
 * use-query-params v2 adapter for the NextJS pages router
 * based on: https://github.com/amannn/next-query-params/blob/main/packages/next-query-params/src/pages/NextAdapterPages.tsx
 * We don't use next-query-params itself, since it only supports NextJS up to v15
 */

import { isBrowser } from '@shared/utils/is-browser';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import React, { memo, type ReactNode, useMemo } from 'react';
import {
	type PartialLocation,
	type QueryParamAdapterComponent,
	type QueryParamOptions,
	QueryParamProvider,
} from 'use-query-params';

const pathnameRegex = /[^?#]+/u;

// Search string of the shallow route change in progress. window.location only changes once a route
// change finishes, so updates in the meantime would start from a stale url and drop the params of
// the pending update (eg: setting the ocr tab and the text overlay at the same moment)
let pendingSearch: string | null = null;

// Keep serializing the url with query-string, like use-query-params v1 did.
// skipNull: a param set to null (eg: closing a blade) is removed, instead of left behind as `?blade`
const queryParamOptions: QueryParamOptions = {
	searchStringToObject: queryString.parse,
	objectToSearchString: (query) => queryString.stringify(query, { skipNull: true }),
};

const NextAdapter: QueryParamAdapterComponent = ({ children }) => {
	const router = useRouter();
	const match = router.asPath.match(pathnameRegex);
	const pathname = match ? match[0] : router.asPath;

	const location = useMemo((): PartialLocation => {
		if (isBrowser()) {
			// For SSG, no query parameters are available on the server side,
			// since they can't be known at build time. Therefore, to avoid
			// markup mismatches, we need a two-part render in this case that
			// patches the client with the updated query parameters lazily.
			// Note that for SSR `router.isReady` will be `true` immediately
			// and therefore there's no two-part render in this case.
			if (router.isReady) {
				return window.location;
			}
			return { search: '' };
		}
		// On the server side we only need the search string
		return { search: router.asPath.replace(pathnameRegex, '') };
	}, [router.asPath, router.isReady]);

	const adapter = useMemo(() => {
		function createUpdater(routeFn: typeof router.push) {
			return function updater({ search }: PartialLocation) {
				const hash = isBrowser() ? window.location.hash : '';
				pendingSearch = search;
				routeFn(
					{ pathname: router.pathname, search, hash },
					{ pathname, search, hash },
					{ shallow: true, scroll: false }
				)
					.catch(() => {
						// A newer navigation cancelled this route change (it carries these params too),
						// or ConfirmModalBeforeUnload blocked it: either way the update is no longer pending
					})
					.finally(() => {
						if (pendingSearch === search) {
							pendingSearch = null;
						}
					});
			};
		}

		return {
			push: createUpdater(router.push),
			replace: createUpdater(router.replace),
			get location() {
				return pendingSearch === null ? location : { search: pendingSearch };
			},
		};
	}, [location, pathname, router]);

	return children(adapter);
};

const NextQueryParamProvider = ({ children }: { children: ReactNode }) => {
	return (
		<QueryParamProvider adapter={NextAdapter} options={queryParamOptions}>
			{children}
		</QueryParamProvider>
	);
};

export default memo(NextQueryParamProvider);
