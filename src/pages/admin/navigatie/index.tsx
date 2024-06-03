import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { ComponentType } from 'react';

import { AdminNavigationOverview } from '@admin/views/navigation/AdminNavigationOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminNavigationOverviewDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <AdminNavigationOverview url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, undefined, ROUTES_BY_LOCALE.nl.adminNavigation);
}

export default withAuth(withAdminCoreConfig(AdminNavigationOverviewDutch as ComponentType), true);
