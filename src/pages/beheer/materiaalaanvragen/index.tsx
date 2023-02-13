import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { CPAdminLayout } from '@cp/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const CPMaterialRequestsPage: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<CPAdminLayout
				className="p-cp-requests"
				pageTitle={tText('pages/beheer/materiaalaanvragen/index___materiaalaanvragen')}
			>
				<h1>REQUEST</h1>
			</CPAdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/beheer/materiaalaanvragen/index___materiaalaanvragen'),
				tText(
					'pages/beheer/materiaalaanvragen/index___materiaalaanvragen-meta-omschrijving'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.VIEW_ANY_MATERIAL_REQUESTS]}>
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

export default withAuth(CPMaterialRequestsPage as ComponentType);
