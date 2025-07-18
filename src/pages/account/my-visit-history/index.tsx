import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import type { ComponentType } from 'react';

import { AccountMyHistory } from '@account/views/AccountMyHistory';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const AccountMyHistoryEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <AccountMyHistory url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.accountMyVisitHistory);
}

export default withAuth(AccountMyHistoryEnglish as ComponentType, true);
