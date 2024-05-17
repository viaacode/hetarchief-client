import { ContentPageEdit } from '@meemoo/admin-core-ui';
import { type Avo } from '@viaa/avo2-types';
import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageEditPage: FC<DefaultSeoInfo & UserProps> = ({ url, commonUser }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout bottomPadding={false} className="p-admin-content-page-create">
				<AdminLayout.Content>
					<div className="p-admin-content__edit">
						<ContentPageEdit
							id={undefined}
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
				tText('pages/admin/content/maak/index___content-pagina-aanmaken'),
				tText(
					'pages/admin/content/maak/index___maak-een-nieuwe-content-pagina-adhv-blokken'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.CREATE_CONTENT_PAGES]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(withUser(ContentPageEditPage) as ComponentType),
	true
) as FC<DefaultSeoInfo>;
