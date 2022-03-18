import { Head, Html, Main, NextScript } from 'next/document';
import { ReactElement } from 'react';

const Document = (): ReactElement => {
	return (
		<Html>
			<Head>
				{/* eslint-disable-next-line */}
				<link rel="stylesheet" href="/flowplayer/style/flowplayer.css" />
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
