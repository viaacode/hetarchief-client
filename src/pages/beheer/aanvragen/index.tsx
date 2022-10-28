import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { RequestTableColumns } from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';
import VisitRequestsOverview from '@visits/components/VisitRequestsOverview/VisitRequestsOverview';

const CPRequestsPage: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<CPAdminLayout
				className="p-cp-requests"
				pageTitle={tHtml('pages/beheer/aanvragen/index___aanvragen')}
			>
				<VisitRequestsOverview columns={RequestTableColumns()} />
			</CPAdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/beheer/aanvragen/index___aanvragen'),
				tText('pages/beheer/aanvragen/index___aanvragen-meta-omschrijving'),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.READ_CP_VISIT_REQUESTS]}>
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

export default withAuth(CPRequestsPage as ComponentType);
