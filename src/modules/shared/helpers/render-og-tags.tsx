import getConfig from 'next/config';
import Head from 'next/head';
import { ReactNode } from 'react';

import { createPageTitle } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

/**
 * Renders Open Graph tags for the page
 * @param title
 * @param description
 * @param url
 * @param imgUrl
 * @param isFullTitle The passed title should be used as is, and should not be appended with " | hetarchief.be"
 */
export function renderOgTags(
	title: string | null | undefined,
	description: string | null | undefined,
	url: string,
	imgUrl: string | null | undefined = null,
	isFullTitle = false
): ReactNode {
	console.log('redering og tags: ', { title, description, url, imgUrl });
	const resolvedTitle = createPageTitle(title);
	return (
		<Head>
			<title>{isFullTitle ? title : resolvedTitle}</title>
			{description && <meta name="description" content={description} />}
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<meta property="og:title" content={resolvedTitle} />
			{description && <meta property="og:description" content={description} />}
			{imgUrl ? (
				<meta property="og:image" content={imgUrl} />
			) : (
				<meta
					property="og:image"
					content={`${publicRuntimeConfig.CLIENT_URL}/images/og.jpg`}
				/>
			)}
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:domain" content={publicRuntimeConfig.CLIENT_URL} />
			<meta property="twitter:title" content={resolvedTitle} />
			{description && <meta property="twitter:description" content={description} />}
		</Head>
	);
}
