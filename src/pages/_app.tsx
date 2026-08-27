import { getAdminCoreConfig } from '@admin/wrappers/admin-core-config';
import { AdminConfigManager } from '@meemoo/admin-core-ui/client';
import getConfig from '@shared/config/public-runtime-config';
import { AppLayout } from '@shared/layouts/AppLayout';
import NextQueryParamProvider from '@shared/providers/NextQueryParamProvider/NextQueryParamProvider';
import { ApiService } from '@shared/services/api-service'; // Set global locale:
import { wrapper } from '@shared/store';
import { Locale } from '@shared/utils/i18n';
import { isServerSideRendering } from '@shared/utils/is-browser';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setDefaultOptions } from 'date-fns';
import nlBE from 'date-fns/locale/nl-BE';
import { lowerCase, upperFirst } from 'es-toolkit/compat';
import HttpApi from 'i18next-http-backend';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next/pages';
import React, { type ReactElement, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import pkg from '../../package.json';

import '@viaa/avo2-components/styles.css';
import '@meemoo/react-components/styles.css';
// import '@meemoo/admin-core-ui/admin.css';
import '@meemoo/admin-core-ui/client.css';
import '../styles/main.scss';

// Set global locale:
// biome-ignore lint/suspicious/noExplicitAny: date fns and nlBE typing issue
setDefaultOptions({ locale: nlBE } as any);

const { publicRuntimeConfig } = getConfig();

// Must NOT be a module-level singleton: on the server that cache would be shared by all SSR
// requests (and never garbage-collected, since gcTime defaults to Infinity there). A pre-existing
// entry makes HydrationBoundary defer hydration to a useEffect that never runs while rendering on
// the server, so prefetched data stops showing up in the SSR html, and cached data can leak
// between users. Create one client per request on the server, one per session in the browser.
const makeQueryClient = (): QueryClient =>
	new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false,
				refetchInterval: false,
				refetchIntervalInBackground: false,
			},
		},
	});

// Temp version with undefined router and nl locale
AdminConfigManager.setConfig(getAdminCoreConfig(null, Locale.nl, null));

function MyApp({ Component, pageProps }: AppProps): ReactElement | null {
	const { store, props } = wrapper.useWrappedStore(pageProps);
	const [queryClient] = useState(makeQueryClient);

	useEffect(() => {
		console.log(`[PERFORMANCE] ${new Date().toISOString()} init hetarchief client`);
		console.info(`%c client version: ${pkg.version}`, 'color: #bada55');
		ApiService.getApi()
			.get('')
			.then(async (response) => {
				try {
					const body = await response.json<{ version: string }>();
					console.info(`%c server version: ${body.version}`, 'color: #bada55');
				} catch (_err) {
					// ignore errors
				}
			});
	}, []);

	if (!isServerSideRendering()) {
		// client-side-only code, window is not available during NextJS server side prerender
		// biome-ignore lint/suspicious/noExplicitAny: Window is not yet typed
		(window as any).APP_VERSION = { version: pkg.version };
	}
	return (
		<>
			<Head>
				{/* https://meemoo.atlassian.net/browse/ARC-2704 */}
				<meta name="viewport" content="width=device-width, initial-scale=0.9" />
			</Head>
			<NextQueryParamProvider>
				<QueryClientProvider client={queryClient}>
					<HydrationBoundary state={pageProps.dehydratedState}>
						<Provider store={store}>
							<AppLayout>
								<Component {...props} />
							</AppLayout>
						</Provider>
					</HydrationBoundary>
				</QueryClientProvider>
			</NextQueryParamProvider>
		</>
	);
}

export default appWithTranslation(MyApp, {
	supportedLngs: ['nl', 'en'],
	i18n: {
		locales: ['nl', 'en'],
		defaultLocale: 'nl',
		localeDetection: false,
	},
	backend: {
		loadPath: `${publicRuntimeConfig.PROXY_URL}/admin/translations/{{lng}}.json`,
		reloadInterval: 60 * 60 * 1000, // 1 hour (server-side i18next instance refresh)
	},
	use: [HttpApi],
	ns: ['common'],
	parseMissingKeyHandler: (key: string) => {
		if (key.includes('___')) {
			return `${upperFirst(lowerCase(key.split('___').pop()))} ***`;
		}
		return `${key} ***`;
	},
	debug: false,
});
