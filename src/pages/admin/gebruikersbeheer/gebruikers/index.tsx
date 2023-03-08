import { UserOverview } from '@meemoo/admin-core-ui';
import { Avo } from '@viaa/avo2-types';
import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';
import { formatDistanceToday } from '@shared/utils';

const UsersOverviewPage: FC<DefaultSeoInfo & UserProps> = ({ url, commonUser }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText('pages/admin/gebruikersbeheer/gebruikers/index___gebruikers')}
			>
				<AdminLayout.Content>
					<div className="l-container">
						<UserOverview
							customFormatDate={formatDistanceToday}
							commonUser={commonUser as Avo.User.CommonUser}
						/>
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
			</PermissionsCheck>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(
	withAdminCoreConfig(withUser(UsersOverviewPage as FC<unknown>))
) as FC<DefaultSeoInfo>;
