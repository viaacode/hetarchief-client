import { Alert, Box, Button } from '@meemoo/react-components';
import { isNil } from 'lodash';
import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';
import { ComponentType, ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { GET_PERMISSION_TRANSLATIONS_BY_GROUP, GroupName, Permission } from '@account/const';
import { AccountLayout } from '@account/layouts';
import { selectUser } from '@auth/store/user';
import { Idp } from '@auth/types';
import { withAuth } from '@auth/wrappers/with-auth';
import { Icon, IconNamesLight } from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

import { VisitorLayout } from 'modules/visitors';

const { publicRuntimeConfig } = getConfig();

const AccountMyProfile: NextPage<DefaultSeoInfo> = ({ url }) => {
	const user = useSelector(selectUser);
	const { tHtml, tText } = useTranslation();

	const isAdminUser: boolean = useHasAnyGroup(GroupName.MEEMOO_ADMIN, GroupName.CP_ADMIN);
	const isKeyUser: boolean = user?.isKeyUser || false;
	const canEdit: boolean =
		user?.idp === Idp.HETARCHIEF && user.permissions.includes(Permission.CAN_EDIT_PROFILE_INFO);

	const renderEditAlert = (): ReactNode => (
		<Alert
			className="p-account-my-profile__general-info-alert u-p-24"
			title={tText('pages/account/mijn-profiel/index___alert-title')}
			content={tHtml('pages/account/mijn-profiel/index___alert-message')}
			icon={<Icon name={IconNamesLight.Exclamation} />}
		/>
	);

	const renderGeneralInfo = (): ReactNode => (
		<dl>
			<dt>{tHtml('pages/account/mijn-profiel/index___voornaam')}</dt>
			<dd className="u-text-ellipsis u-color-neutral">{user?.firstName}</dd>

			<dt>{tHtml('pages/account/mijn-profiel/index___familienaam')}</dt>
			<dd className="u-text-ellipsis u-color-neutral">{user?.lastName}</dd>

			<dt>{tHtml('pages/account/mijn-profiel/index___email')}</dt>
			<dd className="u-text-ellipsis u-color-neutral" title={user?.email}>
				{user?.email}
			</dd>
			{(isAdminUser || isKeyUser) && renderOrganisation()}
		</dl>
	);

	const renderKeyUserInfo = (): ReactNode => (
		<>
			<dt className="u-mt-32">
				{tText(
					'pages/account/mijn-profiel/index___gebruikersrechten-sleutelgebruiker-titel'
				)}
			</dt>
			<dd className="u-color-neutral u-mt-8">
				{tText(
					'pages/account/mijn-profiel/index___gebruikersrechten-sleutelgebruiker-omschrijving'
				)}
			</dd>
		</>
	);

	const renderUserGroup = (): ReactNode => {
		const userGroup: GroupName = user?.groupName as GroupName;
		const { name, description } = GET_PERMISSION_TRANSLATIONS_BY_GROUP()[userGroup];

		return (
			<>
				<dt>{name}</dt>
				<dd className="u-color-neutral u-mt-8">{description}</dd>
			</>
		);
	};

	const renderEditProfile = (): ReactNode => (
		<div className="p-account-my-profile__edit">
			{/* Redirect to SSUM edit profile page => After SSUM redirect to the logout url => after logout redirect to client profile page */}
			{/* Which will redirect to the client homepage => after user logs in, redirect to client profile page */}
			<Link
				href={stringifyUrl({
					url: publicRuntimeConfig.SSUM_EDIT_ACCOUNT_URL,
					query: {
						redirect_to: stringifyUrl({
							url: publicRuntimeConfig.PROXY_URL + '/auth/global-logout',
							query: {
								returnToUrl: window.location.href,
							},
						}),
					},
				})}
				passHref
			>
				<a aria-label={tText('pages/account/mijn-profiel/index___wijzig-mijn-gegevens')}>
					<Button
						className="u-p-0"
						iconStart={<Icon name={IconNamesLight.Edit} />}
						label={tHtml('pages/account/mijn-profiel/index___wijzig-mijn-gegevens')}
						variants="text"
					/>
				</a>
			</Link>
		</div>
	);

	const renderOrganisation = (): ReactNode => {
		if (isNil(user?.organisationName)) {
			return null;
		}

		return (
			<>
				<dt>{tHtml('pages/account/mijn-profiel/index___organisatie')}</dt>

				<dd className="u-text-ellipsis u-color-neutral" title={user?.organisationName}>
					{user?.organisationName}
				</dd>
			</>
		);
	};

	const renderPageContent = () => {
		return (
			<AccountLayout
				className="p-account-my-profile"
				pageTitle={tText('pages/account/mijn-profiel/index___mijn-profiel')}
			>
				<div className="l-container">
					<Box className="p-account-my-profile__user-data u-mb-32">
						<section className="u-p-24 p-account-my-profile__general-info">
							<header className="p-account-my-profile__general-info-header u-mb-24">
								<h6>{tText('pages/account/mijn-profiel/index___algemene-info')}</h6>
								{canEdit && renderEditProfile()}
							</header>
							<div className="p-account-my-profile__general-info-items u-mb-24">
								{renderGeneralInfo()}
							</div>
							{canEdit && renderEditAlert()}
						</section>
					</Box>

					{isAdminUser && (
						<Box className="u-mb-32">
							<section className="u-p-24 p-account-my-profile__permissions">
								<header className="p-account-my-profile__permissions-header u-mb-24">
									<h6>
										{tText(
											'pages/account/mijn-profiel/index___gebruikersrechten'
										)}
									</h6>
								</header>
								<dl className="p-account-my-profile__permissions-list u-mb-24">
									{renderUserGroup()}
									{isKeyUser && renderKeyUserInfo()}
								</dl>
							</section>
						</Box>
					)}
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

export default withAuth(AccountMyProfile as ComponentType, true);
