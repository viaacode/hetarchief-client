import { UsersOverviewPage } from '@admin/views/users/UsersOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { UserProps } from '@shared/hooks/with-user';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

const UsersOverviewPageDutch: NextPage<DefaultSeoInfo & UserProps> = ({ url, locale }) => {
	return <UsersOverviewPage url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.adminUsers);
}

export default withAuth(
	withAdminCoreConfig(UsersOverviewPageDutch as ComponentType),
	true
) as NextPage<DefaultSeoInfo>;
