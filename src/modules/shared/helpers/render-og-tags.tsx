import Head from 'next/head';
import { ReactNode } from 'react';

import { createPageTitle } from '@shared/utils';

export function renderOgTags(
	title: string | undefined,
	description: string,
	clientUrl: string
): ReactNode {
	const resolvedTitle = createPageTitle(title);
	return (
		<Head>
			<title>{resolvedTitle}</title>
			<meta name="description" content={description} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={window.location.href} />
			<meta property="og:title" content={resolvedTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={`${clientUrl}/images/og.jpg`} />
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:domain" content={window.location.origin} />
			<meta property="twitter:title" content={resolvedTitle} />
			<meta property="twitter:description" content={description} />
		</Head>
	);
}
