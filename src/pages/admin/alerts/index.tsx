import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC } from 'react';

import { AdminMaintenanceAlertsOverview } from '@admin/views/MaintenanceAlertsPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminMaintenanceAlertsOverviewEnglish: FC<DefaultSeoInfo> = ({ url }) => {
	return <AdminMaintenanceAlertsOverview url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(AdminMaintenanceAlertsOverviewEnglish as ComponentType),
	true
);
