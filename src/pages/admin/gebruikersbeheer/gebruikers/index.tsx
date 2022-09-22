import { UserOverview } from '@meemoo/react-admin';
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
import { formatDistanceToday } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

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
			{renderOgTags(
				tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers'),
				tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers-omschrijving'),
				publicRuntimeConfig.CLIENT_URL
			)}

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
