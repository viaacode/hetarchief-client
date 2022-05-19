import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React from 'react';

import { Permission } from '@account/const';
import { RequestTableColumns } from '@admin/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import { createPageTitle } from '@shared/utils';
import VisitRequestsOverview from '@visits/components/VisitRequestsOverview/VisitRequestsOverview';

const MeemooAdminRequestsPage: NextPage = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>
					{createPageTitle(t('pages/admin/leeszalenbeheer/aanvragen/index___aanvragen'))}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/leeszalenbeheer/aanvragen/index___aanvragen-meta-omschrijving'
					)}
				/>
			</Head>

			<AdminLayout pageTitle={t('pages/admin/leeszalenbeheer/aanvragen/index___aanvragen')}>
				<AdminLayout.Content>
					<VisitRequestsOverview columns={RequestTableColumns()} />
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAllRequiredPermissions(MeemooAdminRequestsPage, Permission.READ_ALL_VISIT_REQUESTS)
);
