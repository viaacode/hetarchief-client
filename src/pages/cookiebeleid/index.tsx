import { NextPage } from 'next';
import React, { createRef, useEffect } from 'react';

import styles from './cookie-policy.module.scss';

const CookiePolicy: NextPage = () => {
	const cookieBotWrapper = createRef<HTMLDivElement>();

	useEffect(() => {
		if (cookieBotWrapper.current) {
			const script = document.createElement('script');
			script.setAttribute('id', 'CookieDeclaration');
			script.src = 'https://consent.cookiebot.com/8fb68e92-94b2-4334-bc47-7bcda08bc9c7/cd.js';
			cookieBotWrapper.current.innerHTML = '';
			cookieBotWrapper.current.append(script);
		}

		return () => {
			if (cookieBotWrapper.current) {
				cookieBotWrapper.current.innerHTML = '';
			}
		};
	}, [cookieBotWrapper]);

	return <div className={styles['cookie-policy__wrapper']} ref={cookieBotWrapper} />;
};

export default CookiePolicy;
