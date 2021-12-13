import { AppProps } from 'next/app';
import { ReactElement } from 'react';

import { ReadingRoomCard, readingRoomCardType } from 'modules/shared/components';

import '../styles/main.scss';

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	return (
		<div>
			<Component {...pageProps} />
			<ReadingRoomCard
				type={readingRoomCardType['no-access']}
				logo="logo_wide.png"
				title="card title"
				description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
			/>
		</div>
	);
}

export default MyApp;
