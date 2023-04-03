import { ContentPageOverview } from '@meemoo/admin-core-ui';
import { Button } from '@meemoo/react-components';
import { GetServerSidePropsResult } from 'next';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next/types';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { CONTENT_PATH } from '@admin/const/Routing.const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageOverviewPage: FC<DefaultSeoInfo & UserProps> = ({ url, commonUser }) => {
	const { tText } = useTranslation();
	const canCreateContentPages = useHasAllPermission(Permission.CREATE_CONTENT_PAGES) || true; // TODO remove once permission is added to the database

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText('admin/content/views/content-overview___content-overzicht')}
			>
				<AdminLayout.Actions>
					{canCreateContentPages && (
						<Link href={CONTENT_PATH.CONTENT_PAGE_CREATE} passHref>
							<a
								aria-label={tText(
									'admin/content/views/content-overview___maak-een-nieuwe-content-pagina-aan'
								)}
							>
								<Button
									label={tText(
										'admin/content/views/content-overview___content-toevoegen'
									)}
									title={tText(
										'admin/content/views/content-overview___maak-een-nieuwe-content-pagina-aan'
									)}
								/>
							</a>
						</Link>
					)}
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<div className="l-container p-admin-content">
						<ContentPageOverview commonUser={commonUser} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/admin/content/index___content-paginas'),
				tText(
					'pages/admin/content/index___overzicht-van-alle-content-paginas-die-beschikbaar-zijn-binnen-het-archief'
				),
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
	withAdminCoreConfig(withUser(ContentPageOverviewPage as FC<unknown>)),
	true
) as FC<DefaultSeoInfo>;
