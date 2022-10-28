import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import { GetServerSidePropsContext } from 'next/types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, StringParam, useQueryParams, withDefault } from 'use-query-params';

import { AuthModal } from '@auth/components';
import { selectUser } from '@auth/store/user';
import { SHOW_AUTH_QUERY_KEY, VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { withI18n } from '@i18n/wrappers';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';

import styles from './cookie-policy.module.scss';

const { publicRuntimeConfig } = getConfig();

const CookiePolicy: NextPage<DefaultSeoInfo> = ({ url }) => {
	const dispatch = useDispatch();
	const { tText } = useTranslation();
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
		[VISITOR_SPACE_SLUG_QUERY_KEY]: withDefault(StringParam, undefined),
	});
	const [cookieDeclarationHtml, setCookieDeclarationHtml] = useState<string>('');
	const showAuthModal = useSelector(selectShowAuthModal);
	const user = useSelector(selectUser);

	const onCloseAuthModal = () => {
		if (typeof query[SHOW_AUTH_QUERY_KEY] === 'boolean') {
			setQuery({
				[SHOW_AUTH_QUERY_KEY]: undefined,
				[VISITOR_SPACE_SLUG_QUERY_KEY]: undefined,
			});
		}
		dispatch(setShowAuthModal(false));
	};

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
			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return {
		props: {
			url: publicRuntimeConfig.CLIENT_URL + (context?.resolvedUrl || ''),
			...(await withI18n()).props,
		},
	};
}

export default CookiePolicy;
