import { Head, Html, Main, NextScript } from 'next/document';
import { ReactElement } from 'react';

const Document = (): ReactElement => {
	return (
		<Html>
			<Head>
				<link rel="stylesheet" href="/flowplayer/style/flowplayer.css" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
