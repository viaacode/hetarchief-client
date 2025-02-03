import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import React, { type ComponentType, type FC } from 'react';

import { AdminMaintenanceAlertsOverview } from '@admin/views/MaintenanceAlertsPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const AdminMaintenanceAlertsOverviewDutch: FC<DefaultSeoInfo> = ({ url, locale }) => {
	return <AdminMaintenanceAlertsOverview url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.adminAlerts);
}

export default withAuth(
	withAdminCoreConfig(AdminMaintenanceAlertsOverviewDutch as ComponentType),
	true
);
