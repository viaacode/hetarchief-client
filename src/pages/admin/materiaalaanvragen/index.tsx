import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType } from 'react';

import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminMaterialRequests: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText(
					'pages/admin/mijn-materiaalaanvragen/index___mijn-materiaalaanvragen'
				)}
			>
				<AdminLayout.Content />
			</AdminLayout>
		);
	};
	return (
		<>
			{renderOgTags(
				tText('pages/admin/mijn-materiaalaanvragen/index___mijn-materiaalaanvragen'),
				tText(
					'pages/admin/mijn-materiaalaanvragen/index___mijn-materiaalaanvragen-meta-omschrijving'
				),
				url
			)}

			<PermissionsCheck allPermissions={[]}>{renderPageContent()}</PermissionsCheck>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(AdminMaterialRequests as ComponentType);
