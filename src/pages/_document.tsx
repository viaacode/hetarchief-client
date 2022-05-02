import { Head, Html, Main, NextScript } from 'next/document';
import React, { ReactElement } from 'react';

declare type DocumentFiles = {
	sharedFiles: readonly string[];
	pageFiles: readonly string[];
	allFiles: readonly string[];
};

class CustomHead extends Head {
	getScripts(files: DocumentFiles): ReactElement[] {
		const originalScripts = super.getScripts(files);
		return originalScripts.map((script) => {
			return React.cloneElement(script, {
				'data-cookieconsent': 'ignore',
			});
		});
	}
}

const Document = (): ReactElement => {
	return (
		<Html>
			<CustomHead>
				{/* eslint-disable-next-line */}
				<script
					id="Cookiebot"
					src="https://consent.cookiebot.com/uc.js"
					data-cbid="e17bca33-78a0-484e-a204-e05274a65598"
					data-blockingmode="auto"
					type="text/javascript"
				/>
				{/* eslint-disable-next-line */}
				<link rel="stylesheet" href="/flowplayer/style/flowplayer.css" />
			</CustomHead>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
