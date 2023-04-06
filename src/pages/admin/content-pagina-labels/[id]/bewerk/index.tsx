import { ContentPageLabelEdit } from '@meemoo/admin-core-ui';
import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageLabelsEditPage: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-content-page-labels__edit">
						<ContentPageLabelEdit contentPageLabelId={router.query.id as string} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText(
					'pages/admin/content-pagina-labels/id/bewerk/index___content-pagina-label-bewerk-pagina'
				),
				tText(
					'pages/admin/content-pagina-labels/id/bewerk/index___laat-de-gebruik-de-details-van-een-content-pagina-label-aanpassen'
				),
				url
			)}
			<PermissionsCheck anyPermissions={[Permission.EDIT_CONTENT_PAGE_LABELS]}>
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
	withAdminCoreConfig(ContentPageLabelsEditPage as FC<unknown>),
	true
) as FC<DefaultSeoInfo>;
