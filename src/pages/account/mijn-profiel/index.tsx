import { Box, Button } from '@meemoo/react-components';
import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';
import { ComponentType } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@account/const';
import { AccountLayout } from '@account/layouts';
import { selectUser } from '@auth/store/user';
import { Idp } from '@auth/types';
import { withAuth } from '@auth/wrappers/with-auth';
import { Icon } from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

import { VisitorLayout } from 'modules/visitors';

const { publicRuntimeConfig } = getConfig();

const AccountMyProfile: NextPage<DefaultSeoInfo> = ({ url }) => {
	const user = useSelector(selectUser);
	const { tHtml, tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AccountLayout
				className="p-account-my-profile"
				pageTitle={tText('pages/account/mijn-profiel/index___mijn-profiel')}
			>
				<div className="l-container">
					<Box className="p-account-my-profile__user-data u-p-24">
						<dl>
							<dt>{tHtml('pages/account/mijn-profiel/index___voornaam')}</dt>
							<dd className="u-text-ellipsis u-color-neutral">{user?.firstName}</dd>

							<dt>{tHtml('pages/account/mijn-profiel/index___familienaam')}</dt>
							<dd className="u-text-ellipsis u-color-neutral">{user?.lastName}</dd>

							<dt>{tHtml('pages/account/mijn-profiel/index___email')}</dt>
							<dd className="u-text-ellipsis u-color-neutral" title={user?.email}>
								{user?.email}
							</dd>
						</dl>
						{user?.idp === Idp.HETARCHIEF &&
							user.permissions.includes(Permission.CAN_EDIT_PROFILE_INFO) && (
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
										<a
											aria-label={tText(
												'pages/account/mijn-profiel/index___wijzig-mijn-gegevens'
											)}
										>
											<Button
												className="u-p-0"
												iconStart={<Icon name="edit" />}
												label={tHtml(
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
		);
	};
	return (
		<VisitorLayout>
			{renderOgTags(
				tText('pages/account/mijn-profiel/index___mijn-profiel'),
				tText('pages/account/mijn-profiel/index___mijn-profiel-meta-omschrijving'),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT]}>
				{renderPageContent()}
			</PermissionsCheck>
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(AccountMyProfile as ComponentType);
