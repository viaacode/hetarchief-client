import { ContentPageOverview } from '@meemoo/react-admin';
import { Button } from '@meemoo/react-components';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { CONTENT_PATH } from '@admin/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { createPageTitle } from '@shared/utils';

const ContentPageOverviewPage: FC = () => {
	const { t } = useTranslation();
	const canCreateContentPages = useHasAllPermission(Permission.CREATE_CONTENT_PAGES) || true; // TODO remove once permission is added to the database

	return (
		<>
			<Head>
				<title>{createPageTitle(t('pages/admin/content/index___content-paginas'))}</title>
				<meta
					name="description"
					content={t(
						'pages/admin/content/index___overzicht-van-alle-content-paginas-die-beschikbaar-zijn-binnen-het-archief'
					)}
				/>
			</Head>

			<AdminLayout pageTitle={t('admin/content/views/content-overview___content-overzicht')}>
				<AdminLayout.Actions>
					{canCreateContentPages && (
						<Link href={CONTENT_PATH.CONTENT_PAGE_CREATE} passHref>
							<a>
								<Button
									label={t(
										'admin/content/views/content-overview___content-toevoegen'
									)}
									title={t(
										'admin/content/views/content-overview___maak-een-nieuwe-content-pagina-aan'
									)}
								/>
							</a>
						</Link>
					)}
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<div className="l-container">
						<ContentPageOverview />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(ContentPageOverviewPage),
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES
	)
);
