import { NavigationOverview } from '@meemoo/react-admin';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import { createPageTitle } from '@shared/utils';

const AdminNavigationOverview: FC = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('pages/admin/navigatie/index___navigatie'))}</title>
				<meta
					name="description"
					content={t('pages/admin/navigatie/index___navigatie-meta-tag')}
				/>
			</Head>

			<AdminLayout pageTitle={t('pages/admin/navigatie/index___navigatie')}>
				<AdminLayout.Content>
					<div className="l-container u-mb-40 p-admin-navigation">
						<NavigationOverview />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(AdminNavigationOverview),
		Permission.EDIT_NAVIGATION_BARS
	)
);
