import getConfig from 'next/config';
import { type DocumentProps, Head, Html, Main, NextScript } from 'next/document';
import React, { type ReactElement } from 'react';

import { TranslationService } from '@shared/services/translation-service/translation.service';

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

const Document = (props: DocumentProps): ReactElement => {
	const locale = TranslationService.getLocale();

	return (
		<Html lang={locale}>
			<CustomHead>
				{/*eslint-disable-next-line*/}
				<script
					id="Cookiebot"
					src="https://consent.cookiebot.com/uc.js"
					data-cbid="e17bca33-78a0-484e-a204-e05274a65598"
					data-culture={props.locale}
					data-blockingmode="auto"
					type="text/javascript"
				/>

				{/* Google Tag Manager */}
				{/* eslint-disable-next-line @next/next/next-script-for-ga */}
				<script
					id="google-tag-manager-script"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: google tag manager script init
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

				{/* Add preconnect tags to speed up the loading of 3rd party assets/scripts */}
				<link rel="preconnect" href="https://meemoo.zendesk.com" />
				<link rel="preconnect" href="https://static.zdassets.com" />
				<link rel="preconnect" href="https://ekr.zdassets.com" />
				<link rel="preconnect" href="https://www.googletagmanager.com" />
				<link rel="preconnect" href="https://consent.cookiebot.com" />
				<link rel="preconnect" href="https://consentcdn.cookiebot.com" />
				<link rel="preconnect" href="https://imgsct.cookiebot.com" />

				{/* Preload fonts for faster loading of fonts and icons */}
				<link
					rel="preload"
					href="/fonts/sofia-pro/sofia-pro-bold.woff"
					as="font"
					type="font/woff"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/sofia-pro/sofia-pro-regular.woff"
					as="font"
					type="font/woff"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/meemoo-icons-light/meemoo-icons-light.woff"
					as="font"
					type="font/woff"
					crossOrigin="anonymous"
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
						title={'Google Tag Manager'}
					/>
				</noscript>
				{/* End Google Tag Manager (noscript) */}
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
