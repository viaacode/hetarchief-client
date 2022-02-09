import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { withI18n } from '@i18n/wrappers';
import { createPageTitle } from '@shared/utils';

import { CPAdminLayout } from '@cp/layouts';

const CPVisitorsPage: NextPage = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('pages/beheer/bezoekers/index___bezoekers'))}</title>
				<meta
					name="description"
					content={t('pages/beheer/bezoekers/index___beheer-bezoekers-meta-omschrijving')}
				/>
			</Head>

			<CPAdminLayout
				className="p-cp-visitors"
				pageTitle={t('pages/beheer/bezoekers/index___bezoekers')}
			>
				Visitors table
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPVisitorsPage;
