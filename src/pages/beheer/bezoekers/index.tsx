import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { createPageTitle } from '@shared/utils';
import { withI18n } from '@shared/wrappers';

import { CPAdminLayout } from 'modules/cp/layouts';

const CPVisitorsPage: NextPage = () => {
	const { t } = useTranslation();

	return (
		<div className="p-cp-requests">
			<Head>
				<title>{createPageTitle('Bezoekers')}</title>
				<meta name="description" content={t('Beheer Bezoekers meta omschrijving')} />
			</Head>

			<CPAdminLayout pageTitle={t('Bezoekers')}>{/* Visitors table */}</CPAdminLayout>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPVisitorsPage;
