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

// Keep serializing the url with query-string, like use-query-params v1 did
const queryParamOptions: QueryParamOptions = {
	searchStringToObject: queryString.parse,
	objectToSearchString: queryString.stringify,
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
				routeFn(
					{ pathname: router.pathname, search, hash },
					{ pathname, search, hash },
					{ shallow: true, scroll: false }
				);
			};
		}

		return {
			push: createUpdater(router.push),
			replace: createUpdater(router.replace),
			location,
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
