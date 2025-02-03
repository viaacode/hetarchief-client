import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import type { ComponentType } from 'react';

import { AccountMyProfile } from '@account/views/MyProfile';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const AccountMyProfileEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <AccountMyProfile url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.accountMyProfile);
}

export default withAuth(AccountMyProfileEnglish as ComponentType, true);
