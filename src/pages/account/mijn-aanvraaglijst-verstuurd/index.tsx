import { AccountMyApplicationListSent } from '@account/views/AccountMyApplicationListSent';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import type { ComponentType } from 'react';

const AccountMyApplicationListSentDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <AccountMyApplicationListSent url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.accountMyApplicationListSent);
}

export default withAuth(AccountMyApplicationListSentDutch as ComponentType, true);
