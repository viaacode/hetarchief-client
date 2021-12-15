import { AppProps } from 'next/app';
import { ReactElement } from 'react';

import { AppLayout } from '@shared/layouts/AppLayout';

import 'styles/main.scss';

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	return (
		<AppLayout>
			<Component {...pageProps} />
		</AppLayout>
	);
}

export default MyApp;
