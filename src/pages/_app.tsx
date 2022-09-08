import { AppProps } from 'next/app';
import { ComponentType, ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { withTranslation } from '@shared/hoc/withTranslation';
import { AppLayout } from '@shared/layouts/AppLayout';
import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
import { wrapper } from '@shared/store';

import 'styles/main.scss';

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
	withTranslation(MyApp as ComponentType) as ComponentType<AppProps>
);
