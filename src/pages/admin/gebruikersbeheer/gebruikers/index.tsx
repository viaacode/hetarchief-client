import { UserOverview } from '@meemoo/react-admin';
import Head from 'next/head';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { createPageTitle, formatDistanceToday } from '@shared/utils';

const UsersOverview: FC = () => {
	const { tHtml, tText } = useTranslation();

	const renderUsers = () => (
		<>
			<UserOverview customFormatDate={formatDistanceToday} />
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
						tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers')
					)}
				</title>
				<meta
					name="description"
					content={tText(
						'pages/admin/gebruikersbeheer/gebruikers/index___gebruikers-omschrijving'
					)}
				/>
			</Head>

			<AdminLayout
				pageTitle={tHtml('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers')}
			>
				<AdminLayout.Content>
					<div className="l-container">{renderPageContent()}</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(withAdminCoreConfig(UsersOverview), Permission.VIEW_USERS)
);
