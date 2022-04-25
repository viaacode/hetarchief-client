import { Box, Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import getConfig from 'next/config';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { AccountLayout } from '@account/layouts';
import { selectUser } from '@auth/store/user';
import { Idp } from '@auth/types';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { Icon, Loading } from '@shared/components';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { createPageTitle } from '@shared/utils';

import { VisitorLayout } from 'modules/visitors';

const { publicRuntimeConfig } = getConfig();

const AccountMyProfile: NextPage = () => {
	const user = useSelector(selectUser);
	const { t } = useTranslation();
	const canManageAccount: boolean = useHasAllPermission(Permission.MANAGE_ACCOUNT);
	const router = useRouter();

	useEffect(() => {
		if (!canManageAccount) {
			toastService.notify({
				title: t('Geen toegang'),
				description: t('Je hebt geen rechten om deze pagina te bekijken'),
			});
			router.replace('/');
		}
	}, [canManageAccount, router]);

	if (!canManageAccount) {
		return <Loading fullscreen />;
	}

	return (
		<VisitorLayout>
			<Head>
				<title>
					{createPageTitle(t('pages/account/mijn-profiel/index___mijn-profiel'))}
				</title>
				<meta
					name="description"
					content={t('pages/account/mijn-profiel/index___mijn-profiel-meta-omschrijving')}
				/>
			</Head>

			<AccountLayout
				className="p-account-my-profile"
				contentTitle={t('pages/account/mijn-profiel/index___mijn-profiel')}
			>
				<div className="l-container">
					<Box className="p-account-my-profile__user-data u-p-24">
						<dl>
							<dt>{t('pages/account/mijn-profiel/index___voornaam')}</dt>
							<dd className="u-text-ellipsis u-color-neutral">{user?.firstName}</dd>

							<dt>{t('pages/account/mijn-profiel/index___familienaam')}</dt>
							<dd className="u-text-ellipsis u-color-neutral">{user?.lastName}</dd>

							<dt>{t('pages/account/mijn-profiel/index___email')}</dt>
							<dd className="u-text-ellipsis u-color-neutral" title={user?.email}>
								{user?.email}
							</dd>
						</dl>
						{user?.idp === Idp.HETARCHIEF && (
							<div className="p-account-my-profile__edit">
								{/* Redirect to SSUM edit profile page => After SSUM redirect to the logout url => after logout redirect to client profile page */}
								{/* Which will redirect to the client homepage => after user logs in, redirect to client profile page */}
								<Link
									href={stringifyUrl({
										url: publicRuntimeConfig.SSUM_EDIT_ACCOUNT_URL,
										query: {
											redirect_to: stringifyUrl({
												url:
													publicRuntimeConfig.PROXY_URL +
													'/auth/global-logout',
												query: {
													returnToUrl: window.location.href,
												},
											}),
										},
									})}
									passHref
								>
									<a>
										<Button
											className="u-p-0"
											iconStart={<Icon name="edit" />}
											label={t(
												'pages/account/mijn-profiel/index___wijzig-mijn-gegevens'
											)}
											variants="text"
										/>
									</a>
								</Link>
							</div>
						)}
					</Box>
				</div>
			</AccountLayout>
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(AccountMyProfile);
