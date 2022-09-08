import { ContentPageDetail } from '@meemoo/react-admin';
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

const ContentPageDetailPage: FC = () => {
	const { tText } = useTranslation();
	const router = useRouter();

	return (
		<>
			<Head>
				<title>
					{createPageTitle(tText('pages/admin/content/id/index___content-pagina-detail'))}
				</title>
				<meta
					name="description"
					content={tText(
						'pages/admin/content/id/index___detail-pagina-van-een-content-pagina'
					)}
				/>
			</Head>

			<AdminLayout>
				<AdminLayout.Content>
					<ContentPageDetail id={router.query.id as string} />
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(ContentPageDetailPage),
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES
	)
);
