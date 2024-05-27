import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React from 'react';

import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

import { CookiePolicy } from '../../modules/cookie-policy/CookiePolicy';

const CookiePolicyEnglish: NextPage<DefaultSeoInfo> = (seo) => {
	return <CookiePolicy {...seo} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default CookiePolicyEnglish;
