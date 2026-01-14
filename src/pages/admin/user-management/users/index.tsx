import { UsersOverviewPage } from '@admin/views/users/UsersOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type ComponentType, type FC } from 'react';

const UsersOverviewPageEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <UsersOverviewPage url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.adminUsers);
}

export default withAuth(
	withAdminCoreConfig(UsersOverviewPageEnglish as FC<unknown> as ComponentType),
	true
) as NextPage<DefaultSeoInfo>;
