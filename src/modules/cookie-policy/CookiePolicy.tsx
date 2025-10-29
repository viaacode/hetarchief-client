import clsx from 'clsx';
import { format } from 'date-fns';
import { stringifyUrl } from 'query-string';
import React, { type FC, useEffect, useState } from 'react';

import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { DefaultSeoInfo } from '@shared/types/seo';

import styles from './CookiePolicy.module.scss';

export const CookiePolicy: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const locale = useLocale();
	const [cookieDeclarationHtml, setCookieDeclarationHtml] = useState<string>('');

	useEffect(() => {
		// Clear previous html and script
		for (const item of document.querySelectorAll('#CookieDeclaration')) {
			item.remove();
		}
		for (const item of document.querySelectorAll('.p-cookie-policy__wrapper > div')) {
			item.innerHTML = '';
		}

		// Fool cookiebot to inject the html into our react useState
		// biome-ignore lint/suspicious/noExplicitAny: This is a hack to inject the html into the cookie declaration html
		(window as any).CookieDeclaration = {
			InjectCookieDeclaration: (declarationHtml: string) => {
				const declarationHtmlWithCrawlDate = declarationHtml.replace(
					'[#LOCALIZED_CRAWLDATE#]',
					format(
						// biome-ignore lint/suspicious/noExplicitAny: This is a hack to inject the html into the cookie declaration html
						new Date((window as any).CookieDeclaration.lastUpdatedDate),
						'dd MMM yyyy'
					)
				);
				setCookieDeclarationHtml(declarationHtmlWithCrawlDate);
			},
		};

		// Load cookiebot script that has the cookie declaration html baked in
		const script = document.createElement('script');
		// script.onload = moveCookieDeclaration;
		script.id = 'CookieDeclaration';
		script.setAttribute('data-culture', locale);
		script.src = stringifyUrl({
			url: 'https://consent.cookiebot.com/e17bca33-78a0-484e-a204-e05274a65598/cdreport.js',
			query: {
				referer: 'hetarchief.be',
				culture: locale,
			},
		});
		document.head.appendChild(script);
	}, [locale]);

	return (
		<>
			<SeoTags
				title={tText('pages/cookiebeleid/index___cookiebeleid-seo-en-pagina-titel')}
				description={tText(
					'pages/cookiebeleid/index___cookiebeleid-seo-en-pagina-titel-seo-beschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>
			<div className={clsx('p-cookie-policy__wrapper', styles['p-cookie-policy__wrapper'])}>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: This is a hack to inject the html into the cookie declaration html */}
				<div dangerouslySetInnerHTML={{ __html: cookieDeclarationHtml }} />
			</div>
		</>
	);
};
