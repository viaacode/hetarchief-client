import { format } from 'date-fns';
import React, { FC, useEffect, useState } from 'react';

import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

import styles from './CookiePolicy.module.scss';

export const CookiePolicy: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();
	const [cookieDeclarationHtml, setCookieDeclarationHtml] = useState<string>('');

	useEffect(() => {
		// Fool cookiebot to inject the html into our react useState
		// eslint-disable-next-line
		(window as any).CookieDeclaration = {
			InjectCookieDeclaration: (declarationHtml: string) => {
				const declarationHtmlWithCrawlDate = declarationHtml.replace(
					'[#LOCALIZED_CRAWLDATE#]',
					format(
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
		script.src =
			'https://consent.cookiebot.com/e17bca33-78a0-484e-a204-e05274a65598/cdreport.js?referer=hetarchief.be';
		document.head.appendChild(script);
	}, []);

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
			/>
			<div className={styles['p-cookie-policy__wrapper']}>
				<div dangerouslySetInnerHTML={{ __html: cookieDeclarationHtml }} />
			</div>
		</>
	);
};
