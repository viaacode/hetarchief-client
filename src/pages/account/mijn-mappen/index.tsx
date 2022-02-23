import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { AccountLayout } from '@account/layouts';
import { withI18n } from '@i18n/wrappers';
import { createPageTitle } from '@shared/utils';

const AccountMyCollections: NextPage = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('pages/account/mijn-mappen/index___mijn-mappen'))}</title>
				<meta
					name="description"
					content={t('pages/account/mijn-mappen/index___mijn-mappen-meta-omschrijving')}
				/>
			</Head>

			<AccountLayout
				className="p-account-my-collections"
				contentTitle={t('pages/account/mijn-mappen/index___mijn-mappen')}
			>
				<div className="l-container">Collections</div>
			</AccountLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default AccountMyCollections;
