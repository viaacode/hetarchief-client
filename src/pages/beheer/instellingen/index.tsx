import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { createPageTitle } from '@shared/utils';

import { withI18n } from '@i18n/wrappers';
import { CPAdminLayout } from 'modules/cp/layouts';

const CPSettingsPage: NextPage = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t('pages/beheer/instellingen/index___beheer-instellingen-title')
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/beheer/instellingen/index___beheer-instellingen-meta-omschrijving'
					)}
				/>
			</Head>

			<CPAdminLayout
				className="p-cp-settings"
				pageTitle={t('pages/beheer/instellingen/index___instellingen')}
			>
				Settings table
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPSettingsPage;
