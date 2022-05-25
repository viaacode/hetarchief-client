import { NavigationDetail } from '@meemoo/react-admin';
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

const ContentPageDetailPage: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t('pages/admin/navigatie/navigation-bar-id/index___navigatie-balk-detail')
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/navigatie/navigation-bar-id/index___de-detail-pagina-van-een-navigatie-balk-met-de-navigatie-items'
					)}
				/>
			</Head>

			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__detail">
						<NavigationDetail
							navigationBarId={router.query.navigationBarId as string}
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
		withAdminCoreConfig(ContentPageDetailPage),
		Permission.EDIT_NAVIGATION_BARS
	)
);
