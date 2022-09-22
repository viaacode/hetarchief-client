import getConfig from 'next/config';
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

const { publicRuntimeConfig } = getConfig();

const Document = (): ReactElement => {
	return (
		<Html>
			<CustomHead>
				{/*eslint-disable-next-line*/}
				<script
					id="Cookiebot"
					src="https://consent.cookiebot.com/uc.js"
					data-cbid="e17bca33-78a0-484e-a204-e05274a65598"
					data-blockingmode="auto"
					type="text/javascript"
				/>

				{/* Google Tag Manager */}
				<script
					id="google-tag-manager-script"
					dangerouslySetInnerHTML={{
						__html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', '${publicRuntimeConfig.GOOGLE_TAG_MANAGER_ID}');
  `,
					}}
				/>
				{/* End Google Tag Manager */}

				{/*eslint-disable-next-line*/}
				<meta
					name="google-site-verification"
					content="yl7dKP6MImaxOwur77DkLJL4SH9Apy2ytk0baoLq99g"
				/>
			</CustomHead>
			<body>
				<Main />
				{/* Google Tag Manager (noscript) */}
				<noscript>
					<iframe
						src={`https://www.googletagmanager.com/ns.html?id=${publicRuntimeConfig.GOOGLE_TAG_MANAGER_ID}`}
						height="0"
						width="0"
						style={{ display: 'none', visibility: 'hidden' }}
					/>
				</noscript>
				{/* End Google Tag Manager (noscript) */}
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
