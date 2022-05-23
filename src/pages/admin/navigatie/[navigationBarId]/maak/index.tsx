import { NavigationEdit } from '@meemoo/react-admin';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import { createPageTitle } from '@shared/utils';

const ContentPageEditPage: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<Head>
				<title>
					{createPageTitle(t('pages/admin/content/maak/index___content-pagina-bewerken'))}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/content/maak/index___bewerk-pagina-van-een-content-pagina'
					)}
				/>
			</Head>

			<AdminLayout>
				<AdminLayout.Content>
					<div className="p-admin-content__create">
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

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(ContentPageEditPage),
		Permission.EDIT_NAVIGATION_BARS
	)
);
