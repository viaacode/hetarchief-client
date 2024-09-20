import { type GetServerSidePropsResult } from 'next';
import { type GetServerSidePropsContext, type NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { AdminTranslationsOverview } from '@admin/views/translations/AdminTranslationsOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const AdminTranslationsOverviewDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <AdminTranslationsOverview url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.adminTranslations);
}

export default withAuth(withAdminCoreConfig(AdminTranslationsOverviewDutch as ComponentType), true);
