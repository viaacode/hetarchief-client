import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { createPageTitle } from '@shared/utils';
import { withI18n } from '@shared/wrappers';

import { CPAdminLayout } from 'modules/cp/layouts';

const CPRequestsPage: NextPage = () => {
	const { t } = useTranslation();

	return (
		<div className="p-cp-requests">
			<Head>
				<title>{createPageTitle('Aanvragen')}</title>
				<meta name="description" content={t('Aanvragen meta omschrijving')} />
			</Head>

			<CPAdminLayout pageTitle={t('Aanvragen')}>{/* Requests table */}</CPAdminLayout>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPRequestsPage;
