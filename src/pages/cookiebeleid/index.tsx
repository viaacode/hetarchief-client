import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, useQueryParams } from 'use-query-params';

import { AuthModal } from '@auth/components';
import { selectUser } from '@auth/store/user';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import { withI18n } from '@i18n/wrappers';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';

import styles from './cookie-policy.module.scss';

const CookiePolicy: NextPage = () => {
	const dispatch = useDispatch();
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});
	const [cookieDeclarationHtml, setCookieDeclarationHtml] = useState<string>('');
	const showAuthModal = useSelector(selectShowAuthModal);
	const user = useSelector(selectUser);

	const onCloseAuthModal = () => {
		if (typeof query.showAuth === 'boolean') {
			setQuery({ showAuth: undefined });
		}
		dispatch(setShowAuthModal(false));
	};

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
		<>
			<div className={styles['p-cookie-policy__wrapper']}>
				<div dangerouslySetInnerHTML={{ __html: cookieDeclarationHtml }} />
			</div>
			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CookiePolicy;
