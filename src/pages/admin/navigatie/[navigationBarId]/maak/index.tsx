import { NavigationEdit } from '@meemoo/react-admin';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { createPageTitle } from '@shared/utils';

const ContentPageEditPage: FC = () => {
	const { tText } = useTranslation();
	const router = useRouter();

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						tText('pages/admin/content/maak/index___content-pagina-bewerken')
					)}
				</title>
				<meta
					name="description"
					content={tText(
						'pages/admin/content/maak/index___bewerk-pagina-van-een-content-pagina'
					)}
				/>
			</Head>

			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__create">
						<NavigationEdit
							navigationBarId={router.query.navigationBarId as string}
							navigationItemId={undefined}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(ContentPageEditPage),
		Permission.EDIT_NAVIGATION_BARS
	)
);
