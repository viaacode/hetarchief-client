import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { createPageTitle } from '@shared/utils';
import { withI18n } from '@shared/wrappers';

import { CPAdminLayout } from 'modules/cp/layouts';

const CPSettingsPage: NextPage = () => {
	const { t } = useTranslation();

	return (
		<div className="p-cp-settings">
			<Head>
				<title>{createPageTitle('Beheer instellingen title')}</title>
				<meta name="description" content={t('Beheer instellingen meta omschrijving')} />
			</Head>

			<CPAdminLayout pageTitle={t('Instellingen')}>{/* Visitors table */}</CPAdminLayout>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPSettingsPage;
