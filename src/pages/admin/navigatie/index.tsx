import { NavigationOverview } from '@meemoo/react-admin';
import getConfig from 'next/config';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';

const { publicRuntimeConfig } = getConfig();

const AdminNavigationOverview: FC = () => {
	const { tHtml, tText } = useTranslation();

	return (
		<>
			{renderOgTags(
				tText('pages/admin/navigatie/index___navigatie'),
				tText('pages/admin/navigatie/index___navigatie-meta-tag'),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AdminLayout pageTitle={tHtml('pages/admin/navigatie/index___navigatie')}>
				<AdminLayout.Content>
					<div className="l-container u-mb-40 p-admin-navigation">
						<NavigationOverview />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(AdminNavigationOverview),
		Permission.EDIT_NAVIGATION_BARS
	)
);
