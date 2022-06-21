import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import { withI18n } from '@i18n/wrappers';

import styles from './cookie-policy.module.scss';

const CookiePolicy: NextPage = () => {
	const [cookieDeclarationHtml, setCookieDeclarationHtml] = useState<string>('');

	useEffect(() => {
		// Fool cookiebot to inject the html into our react useState
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
		<div className={styles['p-cookie-policy__wrapper']}>
			<div dangerouslySetInnerHTML={{ __html: cookieDeclarationHtml }} />
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CookiePolicy;
