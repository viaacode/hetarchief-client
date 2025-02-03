import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import React from 'react';

import { CookiePolicy } from '@cookie-policy/CookiePolicy';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const CookiePolicyEnglish: NextPage<DefaultSeoInfo> = (seo) => {
	return <CookiePolicy {...seo} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.cookiePolicy);
}

export default CookiePolicyEnglish;
