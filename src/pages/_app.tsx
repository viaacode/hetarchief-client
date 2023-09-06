import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import getConfig from 'next/config';
import { appWithTranslation } from 'next-i18next';
import { ReactElement } from 'react';

import { AppLayout } from '@shared/layouts/AppLayout';
import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
import { wrapper } from '@shared/store';
import { isBrowser } from '@shared/utils';

import 'styles/main.scss';

import { getI18n } from '../../next-i18next.config';
import pkg from '../../package.json';

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

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	if (isBrowser()) {
		// client-side-only code, window is not available during nextjs server side prerender
		(window as any).APP_VERSION = { version: pkg.version };
	}
	return (
		<NextQueryParamProvider>
			<QueryClientProvider client={queryClient}>
				<AppLayout>
					<Component {...pageProps} />
				</AppLayout>
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
