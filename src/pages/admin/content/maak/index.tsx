import { ContentPageEdit } from '@meemoo/react-admin';
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

const ContentPageEditPage: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout bottomPadding={false}>
				<AdminLayout.Content>
					<div className="p-admin-content__edit">
						<ContentPageEdit id={undefined} />
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
	return getDefaultServerSideProps(context);
}

export default withAuth(withAdminCoreConfig(ContentPageEditPage as ComponentType));
