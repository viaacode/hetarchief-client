import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { useEffect, useState } from 'react';

import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

import styles from './cookie-policy.module.scss';

const CookiePolicy: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();
	const [cookieDeclarationHtml, setCookieDeclarationHtml] = useState<string>('');

	useEffect(() => {
		// Fool cookiebot to inject the html into our react useState
		// eslint-disable-next-line
		(window as any).CookieDeclaration = {
			InjectCookieDeclaration: setCookieDeclarationHtml,
		};

		// Load cookiebot script that has the cookie declaration html baked in
		const script = document.createElement('script');
		// script.onload = moveCookieDeclaration;
		script.id = 'CookieDeclaration';
		script.src =
			'https://consent.cookiebot.com/e17bca33-78a0-484e-a204-e05274a65598/cdreport.js';
		document.head.appendChild(script);
	}, []);

	return (
		<>
			{renderOgTags(
				tText('pages/cookiebeleid/index___cookiebeleid-seo-en-pagina-titel'),
				tText(
					'pages/cookiebeleid/index___cookiebeleid-seo-en-pagina-titel-seo-beschrijving'
				),
				url
			)}
			<div className={styles['p-cookie-policy__wrapper']}>
				<div dangerouslySetInnerHTML={{ __html: cookieDeclarationHtml }} />
			</div>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default CookiePolicy;
