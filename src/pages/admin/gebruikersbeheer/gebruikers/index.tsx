import { UserOverview } from '@meemoo/react-admin';
import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';
import { formatDistanceToday } from '@shared/utils';

const UsersOverview: FC<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tHtml('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers')}
			>
				<AdminLayout.Content>
					<div className="l-container">
						<UserOverview customFormatDate={formatDistanceToday} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers'),
				tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers-omschrijving'),
				url
			)}
			<PermissionsCheck allPermissions={[Permission.VIEW_USERS]}>
				{renderPageContent()}
			</PermissionsCheck>{' '}
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(withAdminCoreConfig(UsersOverview as ComponentType));
