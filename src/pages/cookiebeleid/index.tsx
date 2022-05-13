import { GetStaticProps, NextPage } from 'next';
import Script from 'next/script';
import React from 'react';

import { withI18n } from '@i18n/wrappers';

import styles from './cookie-policy.module.scss';

const CookiePolicy: NextPage = () => {
	return (
		<div className={styles['p-cookie-policy__wrapper']}>
			<Script
				src="https://consent.cookiebot.com/8fb68e92-94b2-4334-bc47-7bcda08bc9c7/cd.js"
				id="CookieDeclaration"
				strategy="beforeInteractive"
			/>
		</div>
	);
};

export const getStaticProps: GetStaticProps = withI18n();

export default CookiePolicy;
