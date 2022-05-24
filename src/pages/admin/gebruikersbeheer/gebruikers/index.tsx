import { UserOverview } from '@meemoo/react-admin';
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

const UsersOverview: FC = () => {
	const { t } = useTranslation();

	const renderUsers = () => (
		<>
			<UserOverview />
		</>
	);

	const renderPageContent = () => {
		return renderUsers();
	};

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers')
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/gebruikersbeheer/gebruikers/index___gebruikers-omschrijving'
					)}
				/>
			</Head>

			<AdminLayout
				pageTitle={t('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers')}
			>
				<AdminLayout.Content>
					<div className="l-container">{renderPageContent()}</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(withAdminCoreConfig(UsersOverview), Permission.VIEW_USERS)
);
