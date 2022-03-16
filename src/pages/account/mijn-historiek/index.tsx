import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { AccountLayout } from '@account/layouts';
import { withI18n } from '@i18n/wrappers';
import { createPageTitle } from '@shared/utils';

import VisitorLayout from 'modules/visitors/layouts/VisitorLayout/VisitorLayout';

const AccountMyHistory: NextPage = () => {
	const { t } = useTranslation();

	return (
		<VisitorLayout>
			<Head>
				<title>
					{createPageTitle(t('pages/account/mijn-historiek/index___mijn-historiek'))}
				</title>
				<meta
					name="description"
					content={t(
						'pages/account/mijn-historiek/index___mijn-historiek-meta-omschrijving'
					)}
				/>
			</Head>

			<AccountLayout
				className="p-account-my-history"
				contentTitle={t('pages/account/mijn-historiek/index___mijn-historiek')}
			>
				<div className="l-container">History table</div>
			</AccountLayout>
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default AccountMyHistory;
