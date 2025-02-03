import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { PermissionsOverview } from '@admin/views/permissions/PermissionsOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const PermissionsOverviewEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <PermissionsOverview url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.adminPermissions);
}

export default withAuth(withAdminCoreConfig(PermissionsOverviewEnglish as ComponentType), true);
