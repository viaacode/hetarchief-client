import { ContentPageEdit } from '@meemoo/admin-core-ui';
import { type Avo } from '@viaa/avo2-types';
import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
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
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageEditPage: FC<DefaultSeoInfo & UserProps> = ({ url, commonUser }) => {
	const { tText } = useTranslation();
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout bottomPadding={false} className="p-admin-content-page-edit">
				<AdminLayout.Content>
					<div className="p-admin-content__edit">
						<ContentPageEdit
							id={router.query.id as string}
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
				tText('pages/admin/content/id/bewerk/index___content-pagina-bewerken'),
				tText('pages/admin/content/id/bewerk/index___bewerk-pagina-van-een-content-pagina'),
				url
			)}
			<PermissionsCheck
				anyPermissions={[
					Permission.EDIT_ANY_CONTENT_PAGES,
					Permission.EDIT_OWN_CONTENT_PAGES,
				]}
			>
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
	withAdminCoreConfig(withUser(ContentPageEditPage) as ComponentType),
	true
) as FC<DefaultSeoInfo>;
