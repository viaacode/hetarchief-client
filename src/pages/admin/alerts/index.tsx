import { AdminMaintenanceAlertsOverviewPage } from '@admin/views/MaintenanceAlertsPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import React, { type ComponentType, type FC } from 'react';

const AdminMaintenanceAlertsOverviewEnglish: FC<DefaultSeoInfo> = ({ url, locale }) => {
	return <AdminMaintenanceAlertsOverviewPage url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.adminAlerts);
}

export default withAuth(
	withAdminCoreConfig(AdminMaintenanceAlertsOverviewEnglish as ComponentType),
	true
);
