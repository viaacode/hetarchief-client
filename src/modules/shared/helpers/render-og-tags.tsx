import getConfig from 'next/config';
import Head from 'next/head';
import { ReactNode } from 'react';

import { createPageTitle, isBrowser } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

export function renderOgTags(
	title: string | null | undefined,
	description: string,
	url: string,
	fullTitle = false
): ReactNode {
	const resolvedTitle = createPageTitle(title);
	return (
		<Head>
			<title>{fullTitle ? title : resolvedTitle}</title>
			<meta name="description" content={description} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<meta property="og:title" content={resolvedTitle} />
			<meta property="og:description" content={description} />
			<meta
				property="og:image"
				content={`${
					isBrowser() ? publicRuntimeConfig.CLIENT_URL : process.env.CLIENT_URL
				}/images/og.jpg`}
			/>
			<meta property="twitter:card" content="summary_large_image" />
			<meta
				property="twitter:domain"
				content={isBrowser() ? publicRuntimeConfig.CLIENT_URL : process.env.CLIENT_URL}
			/>
			<meta property="twitter:title" content={resolvedTitle} />
			<meta property="twitter:description" content={description} />
		</Head>
	);
}
