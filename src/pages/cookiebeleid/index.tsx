import { GetStaticProps, NextPage } from 'next';
import Script from 'next/script';
import React from 'react';

import { withI18n } from '@i18n/wrappers';

import styles from './cookie-policy.module.scss';

const CookiePolicy: NextPage = () => {
	return (
		<div className={styles['p-cookie-policy__wrapper']}>
			<Script
				src="https://consent.cookiebot.com/e17bca33-78a0-484e-a204-e05274a65598/cd.js"
				id="CookieDeclaration"
				strategy="beforeInteractive"
			/>
		</div>
	);
};

export const getStaticProps: GetStaticProps = withI18n();

export default CookiePolicy;
