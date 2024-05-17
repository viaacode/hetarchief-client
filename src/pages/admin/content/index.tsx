import { ContentPageOverview } from '@meemoo/admin-core-ui';
import { Button } from '@meemoo/react-components';
import { GetServerSidePropsResult } from 'next';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { ADMIN_CORE_ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageOverviewPage: FC<DefaultSeoInfo & UserProps> = ({ url, commonUser }) => {
	const { tText } = useTranslation();
	const locale = useLocale();
	const canCreateContentPages = useHasAllPermission(Permission.CREATE_CONTENT_PAGES) || true; // TODO remove once permission is added to the database

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText('admin/content/views/content-overview___content-overzicht')}
				className="p-admin-content-page-overview"
			>
				<AdminLayout.Actions>
					{canCreateContentPages && (
						<Link
							href={
								ADMIN_CORE_ROUTES_BY_LOCALE[locale]
									.ADMIN_CONTENT_PAGE_CREATE as string
							}
							passHref
						>
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
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(withUser(ContentPageOverviewPage) as ComponentType),
	true
) as FC<DefaultSeoInfo>;
