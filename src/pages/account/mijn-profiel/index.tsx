import { Box, Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useSelector } from 'react-redux';

import { AccountLayout } from '@account/layouts';
import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { Icon } from '@shared/components';
import { createPageTitle } from '@shared/utils';

const AccountMyProfile: NextPage = () => {
	const user = useSelector(selectUser);
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('Mijn profiel'))}</title>
				<meta name="description" content={t('Mijn profiel meta omschrijving')} />
			</Head>

			<AccountLayout className="p-account-my-profile" contentTitle={t('Mijn profiel')}>
				<div className="l-container">
					<Box className="p-account-my-profile__user-data u-p-24">
						<dl>
							<dt>{t('Voornaam')}</dt>
							<dd className="u-color-neutral">{user?.firstName}</dd>

							<dt>{t('Familienaam')}</dt>
							<dd className="u-color-neutral">{user?.lastName}</dd>

							<dt>{t('Email')}</dt>
							<dd className="u-text-ellipsis u-color-neutral" title={user?.email}>
								{user?.email}
							</dd>
						</dl>
						<div className="p-account-my-profile__edit">
							<Button
								className="u-p-0"
								iconStart={<Icon name="edit" />}
								label={t('Wijzig mijn gegevens')}
								variants="text"
							/>
						</div>
					</Box>
				</div>
			</AccountLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(AccountMyProfile);
