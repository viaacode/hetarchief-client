import { getAdminCoreConfig } from '@admin/wrappers/admin-core-config';
import { AdminConfigManager } from '@meemoo/admin-core-ui/client';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { AppLayout } from '@shared/layouts/AppLayout';
import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
import { wrapper } from '@shared/store';
import { Locale } from '@shared/utils/i18n';
import { isServerSideRendering } from '@shared/utils/is-browser';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import HttpApi from 'i18next-http-backend';
import { lowerCase, upperFirst } from 'lodash-es';
import type { AppProps } from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import React, { type ReactElement, useEffect } from 'react';
import { Provider } from 'react-redux';

import pkg from '../../package.json';

import '../styles/main.scss';
import { ApiService } from '@shared/services/api-service'; // Set global locale:

// Set global locale:
setDefaultOptions({ locale: nlBE });

const { publicRuntimeConfig } = getConfig();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			keepPreviousData: true,
			retry: 0,
		},
	},
});

// Temp version with undefined router and nl locale
AdminConfigManager.setConfig(getAdminCoreConfig(null, Locale.nl));

function MyApp({ Component, pageProps }: AppProps): ReactElement | null {
	const router = useRouter();
	const locale = useLocale();
	const { store, props } = wrapper.useWrappedStore(pageProps);

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

	useEffect(() => {
		AdminConfigManager.setConfig(getAdminCoreConfig(router, locale || Locale.nl));
	}, [locale, router]);

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
					<Hydrate state={pageProps.dehydratedState}>
						<Provider store={store}>
							<AppLayout>
								<Component {...props} />
							</AppLayout>
						</Provider>
					</Hydrate>
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
	},
	use: [HttpApi],
	ns: ['common'],
	parseMissingKeyHandler: (key) => {
		if (key.includes('___')) {
			return `${upperFirst(lowerCase(key.split('___').pop()))} ***`;
		}
		return `${key} ***`;
	},
	debug: false,
});
