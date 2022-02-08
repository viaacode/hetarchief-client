import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { withI18n } from '@i18n/wrappers';
import { createPageTitle } from '@shared/utils';

import { CPAdminLayout } from 'modules/cp/layouts';

const CPRequestsPage: NextPage = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('pages/beheer/aanvragen/index___aanvragen'))}</title>
				<meta
					name="description"
					content={t('pages/beheer/aanvragen/index___aanvragen-meta-omschrijving')}
				/>
			</Head>

			<CPAdminLayout
				className="p-cp-requests"
				pageTitle={t('pages/beheer/aanvragen/index___aanvragen')}
			>
				Requests table
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPRequestsPage;
