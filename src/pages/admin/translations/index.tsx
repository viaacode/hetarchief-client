import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { ComponentType } from 'react';

import { AdminTranslationsOverview } from '@admin/views/translations/AdminTranslationsOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminTranslationsOverviewEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <AdminTranslationsOverview url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(AdminTranslationsOverviewEnglish as ComponentType),
	true
);
