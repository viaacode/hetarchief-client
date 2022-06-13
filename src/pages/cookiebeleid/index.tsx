import { GetStaticProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import { withI18n } from '@i18n/wrappers';

import styles from './cookie-policy.module.scss';

const CookiePolicy: NextPage = () => {
	const [cookieDeclarationHtml, setCookieDeclarationHtml] = useState<string>('');

	const moveCookieDeclaration = () => {
		const declaration = document.getElementsByClassName('CookieDeclaration');
		if (
			!declaration[0] ||
			!declaration?.[0]?.parentElement?.innerHTML?.toLowerCase()?.includes('meemoo')
		) {
			setTimeout(moveCookieDeclaration, 100);
			return;
		}
		const parent = declaration[0].parentElement;
		setCookieDeclarationHtml(parent?.innerHTML || '');
		parent?.remove();
	};

	useEffect(() => {
		const script = document.createElement('script');
		script.onload = moveCookieDeclaration;
		script.id = 'CookieDeclaration';
		script.src = 'https://consent.cookiebot.com/e17bca33-78a0-484e-a204-e05274a65598/cd.js';
		document.head.appendChild(script);
	}, []);

	return (
		<div className={styles['p-cookie-policy__wrapper']}>
			<div dangerouslySetInnerHTML={{ __html: cookieDeclarationHtml }} />
		</div>
	);
};

export const getStaticProps: GetStaticProps = withI18n();

export default CookiePolicy;
