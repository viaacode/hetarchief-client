import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { AccountLayout } from '@account/layouts';
import { withI18n } from '@i18n/wrappers';
import { createPageTitle } from '@shared/utils';

const AccountMyHistory: NextPage = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('Mijn historiek'))}</title>
				<meta name="description" content={t('Mijn historiek meta omschrijving')} />
			</Head>

			<AccountLayout className="p-account-my-history" contentTitle={t('Mijn historiek')}>
				<div className="l-container">History table</div>
			</AccountLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default AccountMyHistory;
