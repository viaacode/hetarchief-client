import { ContentPageEdit } from '@meemoo/react-admin';
import Head from 'next/head';
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

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						tText('pages/admin/content/maak/index___content-pagina-aanmaken')
					)}
				</title>
				<meta
					name="description"
					content={tText(
						'pages/admin/content/maak/index___maak-een-nieuwe-content-pagina-adhv-blokken'
					)}
				/>
			</Head>

			<AdminLayout>
				<AdminLayout.Content>
					<div className="p-admin-content__edit">
						<ContentPageEdit id={undefined} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(ContentPageEditPage),
		Permission.CREATE_CONTENT_PAGES
	)
);
