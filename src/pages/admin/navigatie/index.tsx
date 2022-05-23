import { NavigationOverview } from '@meemoo/react-admin';
import { Button } from '@meemoo/react-components';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { FC, useRef } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { TranslationsOverviewRef } from '@admin/types';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import { createPageTitle } from '@shared/utils';

const AdminNavigationOverview: FC = () => {
	const { t } = useTranslation();

	// Access child functions
	const translationsRef = useRef<TranslationsOverviewRef>();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('Navigatie'))}</title>
				<meta name="description" content={t('Navigatie meta tag')} />
			</Head>

			<AdminLayout pageTitle={t('Navigatie')}>
				<AdminLayout.Content>
					<div className="l-container u-mb-40 p-admin-vertalingen">
						<NavigationOverview />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	// withAnyRequiredPermissions(
	withAdminCoreConfig(AdminNavigationOverview)
	// Permission.EDIT_TRANSLATIONS
	// )
);
