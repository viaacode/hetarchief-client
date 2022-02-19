import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { AccountLayout } from '@account/layouts';
import { withI18n } from '@i18n/wrappers';
import { createPageTitle } from '@shared/utils';

const AccountMyProfile: NextPage = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('Mijn profiel'))}</title>
				<meta name="description" content={t('Mijn profiel meta omschrijving')} />
			</Head>

			<AccountLayout className="p-account-my-profile" contentTitle={t('Mijn profiel')}>
				<div className="l-container">Profile data</div>
			</AccountLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default AccountMyProfile;
