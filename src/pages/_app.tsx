import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { ReactElement, useCallback, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AppLayout } from '@shared/layouts/AppLayout';
import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';
import { wrapper } from '@shared/store';

import 'styles/main.scss';
import { useRouter } from 'next/router';

import { LOCAL_STORAGE, ROUTES } from '@shared/const';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	const router = useRouter();

	useEffect(() => {
		const blacklist = [ROUTES.termsOfService];
		const onBeforeHistoryChange = (url: string) => {
			!blacklist.includes(url) && localStorage.setItem(LOCAL_STORAGE.previousPage, url);
		};

		router.events.on('beforeHistoryChange', onBeforeHistoryChange);

		return () => {
			router.events.off('beforeHistoryChange', onBeforeHistoryChange);
		};
	});

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

export default wrapper.withRedux(appWithTranslation(MyApp));
