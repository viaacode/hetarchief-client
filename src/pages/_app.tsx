import { AdminConfigManager } from '@meemoo/admin-core-ui';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import { AppProps } from 'next/app';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import React, { ReactElement, useEffect } from 'react';

import { getAdminCoreConfig } from '@admin/wrappers/admin-core-config';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { AppLayout } from '@shared/layouts/AppLayout';
import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
import { wrapper } from '@shared/store';
import { isBrowser, Locale } from '@shared/utils';

import { getI18n } from '../../next-i18next.config.mjs';
import pkg from '../../package.json';

import '../styles/main.scss';

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

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	const router = useRouter();
	const locale = useLocale();

	useEffect(() => {
		AdminConfigManager.setConfig(getAdminCoreConfig(router, locale));
	}, [router, locale]);

	if (isBrowser()) {
		// client-side-only code, window is not available during nextjs server side prerender
		(window as any).APP_VERSION = { version: pkg.version };
	}
	return (
		<NextQueryParamProvider>
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<AppLayout>
						<Component {...pageProps} />
					</AppLayout>
				</Hydrate>
			</QueryClientProvider>
		</NextQueryParamProvider>
	);
}

export default wrapper.withRedux(
	appWithTranslation(
		MyApp,
		getI18n(isBrowser() ? publicRuntimeConfig.PROXY_URL : process.env.PROXY_URL) as any
	)
);
