import { AppProps } from 'next/app';
import { ReactElement } from 'react';

import { AppLayout } from '@shared/layouts/AppLayout';
import { NextQueryParamProvider } from '@shared/providers/NextQueryParamProvider';

import 'styles/main.scss';

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	return (
		<NextQueryParamProvider>
			<AppLayout>
				<Component {...pageProps} />
			</AppLayout>
		</NextQueryParamProvider>
	);
}

export default MyApp;
