import { yupResolver } from '@hookform/resolvers/yup';
import {
	Alert,
	Box,
	Button,
	Checkbox,
	CheckboxList,
	keysEnter,
	keysSpacebar,
	onKey,
} from '@meemoo/react-components';
import { useQueryClient } from '@tanstack/react-query';
import { isNil } from 'lodash-es';
import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { type ComponentType, type FC, type ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import {
	COMMUNICATION_FORM_SCHEMA,
	GET_PERMISSION_TRANSLATIONS_BY_GROUP,
	GET_TRANSLATED_LANGUAGE_LABELS,
	GroupName,
	Permission,
} from '@account/const';
import { COMMUNICATION_SECTION_ID } from '@account/const/MyProfile.consts';
import { useGetNewsletterPreferences } from '@account/hooks/get-newsletter-preferences';
import { AccountLayout } from '@account/layouts';
import type { CommunicationFormState } from '@account/types';
import { checkLoginAction, selectCommonUser } from '@auth/store/user';
import { Idp } from '@auth/types';
import { withAuth } from '@auth/wrappers/with-auth';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { changeApplicationLocale } from '@shared/helpers/change-application-locale';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useGetAllLanguages } from '@shared/hooks/use-get-all-languages/use-get-all-languages';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service';
import { toastService } from '@shared/services/toast-service';
import { useAppDispatch } from '@shared/store';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import { VisitorLayout } from '@visitor-layout/index';

const { publicRuntimeConfig } = getConfig();

const labelKeys: Record<keyof CommunicationFormState, string> = {
	acceptNewsletter: 'Communication__acceptNewsletter',
};

export const AccountMyProfile: FC<DefaultSeoInfo> = ({ url }) => {
	const dispatch = useAppDispatch();
	const commonUser = useSelector(selectCommonUser);
	const currentAccountLocale = (commonUser?.language || Locale.nl) as Locale;
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
	const [acceptNewsletter, setAcceptNewsletter] = useState<boolean>(false);
	const [selectedLanguage, setSelectedLanguage] = useState<Locale>(
		currentAccountLocale || Locale.nl
	);
	const isAdminUser: boolean = useHasAnyGroup(GroupName.MEEMOO_ADMIN, GroupName.CP_ADMIN);
	const canEditProfile: boolean = useHasAllPermission(Permission.CAN_EDIT_PROFILE_INFO);
	const isKeyUser: boolean = useIsKeyUser();
	const { data: allLanguages } = useGetAllLanguages();
	const { data: preferences } = useGetNewsletterPreferences(commonUser?.email);

	const {
		formState: { errors },
	} = useForm<CommunicationFormState>({
		resolver: yupResolver(COMMUNICATION_FORM_SCHEMA()),
	});

	const canEdit =
		commonUser?.idp && (commonUser.idp as unknown as Idp) === Idp.HETARCHIEF && canEditProfile;

	useEffect(() => {
		if (currentAccountLocale && !selectedLanguage) {
			setSelectedLanguage(currentAccountLocale);
		}
	}, [currentAccountLocale, selectedLanguage]);

	useEffect(() => {
		if (isNil(preferences)) {
			return;
		}

		setAcceptNewsletter(preferences.newsletter);
		if (window.location.href.endsWith(`#${COMMUNICATION_SECTION_ID}`)) {
			const section = document.getElementById(COMMUNICATION_SECTION_ID);
			section?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [preferences]);

	const onFormSubmit = async (newsletter: boolean) => {
		if (!commonUser) {
			return;
		}

		try {
			await CampaignMonitorService.setPreferences({
				preferences: {
					newsletter,
				},
			});

			setAcceptNewsletter(newsletter);
			setIsFormSubmitting(false);
		} catch (err) {
			console.error(err);

			toastService.notify({
				maxLines: 3,
				title: tText('pages/account/mijn-profiel/index___error-communicatie'),
				description: tText(
					'pages/account/mijn-profiel/index___error-communicatie-er-is-iets-misgelopen'
				),
			});

			setIsFormSubmitting(false);
		}
	};

	const handleSelectedLanguageChanged = async (newLocale: Locale) => {
		setSelectedLanguage(newLocale);
		await changeApplicationLocale(
			currentAccountLocale,
			newLocale,
			router,
			queryClient,
			undefined,
			commonUser
		);
		// biome-ignore lint/suspicious/noExplicitAny: todo replace redux with Jotai
		dispatch(checkLoginAction() as any);
	};

	const onUpdateAcceptNewsletter = async (newSubscribeNewsletter: boolean): Promise<void> => {
		setIsFormSubmitting(true);
		await onFormSubmit(!newSubscribeNewsletter);
	};

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
			<dd className="u-text-ellipsis u-color-neutral">{commonUser?.firstName}</dd>

			<dt>{tHtml('pages/account/mijn-profiel/index___familienaam')}</dt>
			<dd className="u-text-ellipsis u-color-neutral">{commonUser?.lastName}</dd>

			<dt>{tHtml('pages/account/mijn-profiel/index___email')}</dt>
			<dd className="u-text-ellipsis u-color-neutral" title={commonUser?.email}>
				{commonUser?.email}
			</dd>
			{renderOrganisation()}
		</dl>
	);

	const renderKeyUserInfo = (): ReactNode =>
		isKeyUser && (
			<>
				<dt className="u-mt-32">
					{tText('pages/account/mijn-profiel/index___gebruikersrechten-sleutelgebruiker-titel')}
				</dt>
				<dd className="u-color-neutral u-mt-8">
					{tHtml(
						'pages/account/mijn-profiel/index___gebruikersrechten-sleutelgebruiker-omschrijving'
					)}
				</dd>
			</>
		);

	const renderUserGroup = (): ReactNode => {
		const userGroup: GroupName = commonUser?.userGroup?.name as GroupName;
		const { name, description, isHidden } = GET_PERMISSION_TRANSLATIONS_BY_GROUP()[userGroup];

		return (
			!isHidden && (
				<>
					<dt>{name}</dt>
					<dd className="u-color-neutral u-mt-8">{description}</dd>
				</>
			)
		);
	};

	const renderEditProfile = (): ReactNode => (
		<div className="p-account-my-profile__edit">
			{/* Redirect to SSUM edit profile page => After SSUM redirect to the logout url => after logout redirect to client profile page */}
			{/* Which will redirect to the client homepage => after user logs in, redirect to client profile page */}
			<Link
				href={stringifyUrl({
					url: publicRuntimeConfig.SSUM_EDIT_ACCOUNT_URL.replace('{locale}', currentAccountLocale),
					query: {
						redirect_to: stringifyUrl({
							url: `${publicRuntimeConfig.PROXY_URL}/auth/global-logout`,
							query: {
								returnToUrl: window.location.href,
							},
						}),
					},
				})}
				passHref
				aria-label={tText('pages/account/mijn-profiel/index___wijzig-mijn-gegevens')}
			>
				<Button
					className="u-p-0"
					iconStart={<Icon name={IconNamesLight.Edit} />}
					label={tHtml('pages/account/mijn-profiel/index___wijzig-mijn-gegevens')}
					variants="text"
				/>
			</Link>
		</div>
	);

	const renderOrganisation = (): ReactNode => {
		if (isNil(commonUser?.organisation?.name)) {
			return null;
		}

		return (
			<>
				<dt>{tHtml('pages/account/mijn-profiel/index___organisatie')}</dt>

				<dd className="u-text-ellipsis u-color-neutral" title={commonUser?.organisation?.name}>
					{commonUser?.organisation?.name}
				</dd>
			</>
		);
	};

	const renderNewsletterForm = (): ReactNode => (
		<>
			<Checkbox
				checked={acceptNewsletter}
				checkIcon={<Icon name={IconNamesLight.Check} />}
				id={labelKeys.acceptNewsletter}
				value="accept-newsletter"
				label={tHtml('pages/account/mijn-profiel/index___ik-ontvang-graag-de-nieuwsbrief')}
				disabled={isFormSubmitting}
				showSpinner={isFormSubmitting}
				onClick={() => onUpdateAcceptNewsletter(acceptNewsletter)}
				onKeyDown={(e) => {
					onKey(e, [...keysEnter, ...keysSpacebar], () => {
						if (keysSpacebar.includes(e.key)) {
							e.preventDefault();
						}

						onUpdateAcceptNewsletter(acceptNewsletter);
					});
				}}
			/>
			<RedFormWarning
				error={errors.acceptNewsletter?.message}
				key="form-error--accept-newsletter"
				className="u-mt-8"
			/>
		</>
	);

	const renderLanguagePreferencesForm = () => (
		<CheckboxList
			items={
				allLanguages?.map((language) => ({
					label: GET_TRANSLATED_LANGUAGE_LABELS()[language.languageCode],
					value: language.languageCode,
					checked: selectedLanguage === language.languageCode,
				})) || []
			}
			onItemClick={(_, value) => handleSelectedLanguageChanged(value as Locale)}
		/>
	);

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

					{(isAdminUser || isKeyUser) && (
						<Box className="u-mb-32">
							<section className="u-p-24 p-account-my-profile__permissions">
								<header className="p-account-my-profile__permissions-header u-mb-24">
									<h6>{tText('pages/account/mijn-profiel/index___gebruikersrechten')}</h6>
								</header>
								<dl className="p-account-my-profile__permissions-list u-mb-24">
									{renderUserGroup()}
									{renderKeyUserInfo()}
								</dl>
							</section>
						</Box>
					)}

					<Box className="u-mb-32">
						<section
							className="u-p-24 p-account-my-profile__communication"
							id={COMMUNICATION_SECTION_ID}
						>
							<header className="p-account-my-profile__communication-header u-mb-24">
								<h6>{tText('pages/account/mijn-profiel/index___communicatie')}</h6>
							</header>
							<div className="p-account-my-profile__communication-list u-mb-24">
								{renderNewsletterForm()}
							</div>
						</section>
					</Box>
					<Box className={'u-mb-32'}>
						<section className="u-p-24 p-account-my-profile__language-preferences">
							<header className="p-account-my-profile__language-preferences-header u-mb-24">
								<h6>{tText('modules/account/views/my-profile___taalvoorkeuren')}</h6>
							</header>
							<div className="p-account-my-profile__language-preferences-list u-mb-24">
								{renderLanguagePreferencesForm()}
							</div>
						</section>
					</Box>
				</div>
			</AccountLayout>
		);
	};
	return (
		<VisitorLayout>
			<SeoTags
				title={tText('pages/account/mijn-profiel/index___mijn-profiel')}
				description={tText('pages/account/mijn-profiel/index___mijn-profiel-meta-omschrijving')}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT]}>
				{renderPageContent()}
			</PermissionsCheck>
		</VisitorLayout>
	);
};

export default withAuth(AccountMyProfile as ComponentType, true);
