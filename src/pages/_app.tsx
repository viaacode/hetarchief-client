import { appWithTranslation, UserConfig } from 'next-i18next';
import { AppProps } from 'next/app';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AppLayout } from '@shared/layouts/AppLayout';
import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
import { wrapper } from '@shared/store';

import NextI18nextConfig from '../../next-i18next.config';

import 'styles/main.scss';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			keepPreviousData: true,
		},
	},
});

function MyApp({ Component, pageProps }: AppProps): ReactElement {
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
