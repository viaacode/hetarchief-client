import { NavigationOverview } from '@meemoo/react-admin';
import Head from 'next/head';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { createPageTitle } from '@shared/utils';

const AdminNavigationOverview: FC = () => {
	const { t, tText } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(tText('pages/admin/navigatie/index___navigatie'))}</title>
				<meta
					name="description"
					content={tText('pages/admin/navigatie/index___navigatie-meta-tag')}
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

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(AdminNavigationOverview),
		Permission.EDIT_NAVIGATION_BARS
	)
);
