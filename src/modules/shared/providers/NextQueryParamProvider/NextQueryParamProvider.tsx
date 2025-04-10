/**
 * based on:
 * - https://github.com/amannn/next-query-params
 * - https://github.com/pbeshai/use-query-params/issues/13
 * Waiting for official support in use-query-params
 */
import { useRouter } from 'next/router';
import React, { type ComponentProps, memo, useMemo } from 'react';
import { QueryParamProvider } from 'use-query-params';

import { isBrowser } from '@shared/utils/is-browser';

type Props = Omit<
	ComponentProps<typeof QueryParamProvider>,
	'ReactRouterRoute' | 'reachHistory' | 'history' | 'location'
>;

const pathnameRegex = /[^?#]+/u;

const NextQueryParamProvider = ({ children, ...rest }: Props) => {
	const router = useRouter();
	const match = router.asPath.match(pathnameRegex);
	const pathname = match ? match[0] : router.asPath;

	const location = useMemo(() => {
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
			return { search: '' } as Location;
		}
		// On the server side we only need a subset of the available
		// properties of `Location`. The other ones are only necessary
		// for interactive features on the client.
		return { search: router.asPath.replace(pathnameRegex, '') } as Location;
	}, [router.asPath, router.isReady]);

	const history = useMemo(() => {
		function createUpdater(routeFn: typeof router.push) {
			return function updater({ hash, search }: Location) {
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

	return (
		<QueryParamProvider {...rest} history={history} location={location}>
			{children}
		</QueryParamProvider>
	);
};

export default memo(NextQueryParamProvider);
