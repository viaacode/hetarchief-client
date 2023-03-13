import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { appWithTranslation, UserConfig } from 'next-i18next';
import { AppProps } from 'next/app';
import { ReactElement } from 'react';

import { AppLayout } from '@shared/layouts/AppLayout';
import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
import { wrapper } from '@shared/store';

import 'styles/main.scss';

import NextI18nextConfig from '../../next-i18next.config';
import pkg from '../../package.json';

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
	if (typeof window !== 'undefined') {
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

export default wrapper.withRedux(appWithTranslation(MyApp, NextI18nextConfig as UserConfig));
