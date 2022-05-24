import { ContentPageEdit } from '@meemoo/react-admin';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import { createPageTitle } from '@shared/utils';

const ContentPageEditPage: FC = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('Content pagina aanmaken'))}</title>
				<meta
					name="description"
					content={t('Maak een nieuwe content pagina adhv blokken')}
				/>
			</Head>

			<AdminLayout>
				<AdminLayout.Content>
					<div className="p-admin-content__edit">
						<ContentPageEdit id={undefined} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(ContentPageEditPage),
		Permission.CREATE_CONTENT_PAGES
	)
);
