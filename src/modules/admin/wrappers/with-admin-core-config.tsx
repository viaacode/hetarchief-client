import {
	AdminConfig,
	AdminConfigManager,
	CommonUser,
	ContentBlockType,
	LinkInfo,
	ToastInfo,
} from '@meemoo/admin-core-ui';
import { DatabaseType } from '@viaa/avo2-types';
import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { ComponentType, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from '@auth/store/user';
import { Icon, ICON_LIST_CONFIG, IconName, sortingIcons } from '@shared/components';
import Loading from '@shared/components/Loading/Loading';
import { ADMIN_CORE_ROUTES, ROUTE_PARTS } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { ApiService } from '@shared/services/api-service';
import { AssetsService } from '@shared/services/assets-service/assets.service';
import { toastService } from '@shared/services/toast-service';
import { isBrowser } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

const InternalLink = (linkInfo: LinkInfo) => {
	const { to, ...rest } = linkInfo;

	return (
		to && (
			<Link href={to} passHref>
				<a {...rest} />
			</Link>
		)
	);
};

// When a content page is saved, for clear the nextjs cache
const onSaveContentPage = async (contentPageInfo: { path: string }) => {
	await ApiService.getApi(false).post(
		stringifyUrl({
			url: 'client-cache/clear-cache',
			query: { path: contentPageInfo.path },
		})
	);
};

export const withAdminCoreConfig = (WrappedComponent: ComponentType): ComponentType => {
	return function withAdminCoreConfig(props: Record<string, unknown>) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [adminCoreConfig, setAdminCoreConfig] = useState<AdminConfig | null>(null);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const user = useSelector(selectUser);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const router = useRouter();

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const initConfigValue = useCallback(() => {
			const commonUser: CommonUser = {
				uid: user?.id,
				profileId: user?.id as string,
				userId: user?.id,
				idp: user?.idp,
				email: user?.email,
				acceptedTosAt: user?.acceptedTosAt,
				userGroup: {
					name: user?.groupName,
					id: user?.groupId,
				},
				firstName: user?.firstName,
				lastName: user?.lastName,
				fullName: user?.fullName,
				// last_access_at: user.lastAccessAt, // TODO enable once last_access_at field is added to the database
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				permissions: user?.permissions as any[],
				tempAccess: undefined,
			};

			const config: AdminConfig = {
				staticPages: [
					'/',
					'/404',
					`/${ROUTE_PARTS.account}/${ROUTE_PARTS.myHistory}`,
					`/${ROUTE_PARTS.account}/${ROUTE_PARTS.myProfile}`,
					`/${ROUTE_PARTS.account}/${ROUTE_PARTS.myFolders}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitRequests}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.activeVisitors}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitorSpaces}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userManagement}/${ROUTE_PARTS.users}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userManagement}/${ROUTE_PARTS.permissions}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
					`/${ROUTE_PARTS.beheer}/${ROUTE_PARTS.visitRequests}`,
					`/${ROUTE_PARTS.beheer}/${ROUTE_PARTS.activeVisitors}`,
					`/${ROUTE_PARTS.beheer}/${ROUTE_PARTS.settings}`,
					`/${ROUTE_PARTS.cookiePolicy}`,
					`/${ROUTE_PARTS.userPolicy}`,
					`/${ROUTE_PARTS.logout}`,
					`/${ROUTE_PARTS.search}`,
				],
				contentPage: {
					availableContentBlocks: [
						ContentBlockType.Heading,
						ContentBlockType.Intro,
						ContentBlockType.RichText,
						ContentBlockType.RichTextTwoColumns,
						ContentBlockType.Buttons,
						ContentBlockType.Image,
						ContentBlockType.ImageGrid,
						ContentBlockType.PageOverview,
						ContentBlockType.UspGrid,
						ContentBlockType.Quote,
					],
					defaultPageWidth: 'LARGE',
					onSaveContentPage,
				},
				navigationBars: { enableIcons: true },
				icon: {
					component: ({ name }: { name: string }) => <Icon name={name as IconName} />,
					componentProps: {
						add: { name: 'plus' },
						view: { name: 'show' },
						angleDown: { name: 'angle-down' },
						angleUp: { name: 'angle-up' },
						angleLeft: { name: 'angle-left' },
						angleRight: { name: 'angle-right' },
						extraOptions: { name: 'dots-vertical' },
						copy: { name: 'copy' },
						delete: { name: 'trash' },
						edit: { name: 'edit' },
						filter: { name: 'search' },
						arrowUp: { name: 'arrow-up' },
						sortTable: { name: 'sort-table' },
						arrowDown: { name: 'arrow-down' },
						chevronLeft: { name: 'angle-left' },
					},
					list: ICON_LIST_CONFIG,
				},
				components: {
					loader: {
						component: () => <Loading fullscreen owner="admin-core-loader" />,
					},
					buttonTypes: () => [
						{
							label: tText('modules/admin/wrappers/with-admin-core-config___zilver'),
							value: 'content-page-button--silver',
						},
						{
							label: tText(
								'modules/admin/wrappers/with-admin-core-config___blauw-groen'
							),
							value: 'content-page-button--teal',
						},
						{
							label: tText('modules/admin/wrappers/with-admin-core-config___wit'),
							value: 'content-page-button--white',
						},
						{
							label: tText('modules/admin/wrappers/with-admin-core-config___zwart'),
							value: 'content-page-button--black',
						},
						{
							label: tText('modules/admin/wrappers/with-admin-core-config___outline'),
							value: 'content-page-button--outline',
						},
						{
							label: tText('modules/admin/wrappers/with-admin-core-config___tekst'),
							value: 'content-page-button--text',
						},
						{
							label: tText('modules/admin/wrappers/with-admin-core-config___rood'),
							value: 'content-page-button--red',
						},
						{
							label: tText('modules/admin/wrappers/with-admin-core-config___link'),
							value: 'content-page-button--link',
						},
					],
				},
				content_blocks: {},
				services: {
					toastService: {
						showToast: (toastInfo: ToastInfo) => {
							toastService.notify({
								title: toastInfo.title,
								description: toastInfo.description,
							});
						},
					},
					i18n: { tHtml, tText },
					educationOrganisationService: {
						fetchEducationOrganisationName: () => Promise.resolve(null),
						fetchCities: () => Promise.resolve([]),
						fetchEducationOrganisations: () => Promise.resolve([]),
					},
					router: {
						Link: InternalLink as FunctionComponent<LinkInfo>,
						useHistory: () => ({
							push: router.push,
							replace: router.replace,
						}),
					},
					queryCache: {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						clear: async (_key: string) => Promise.resolve(),
					},
					assetService: {
						uploadFile: AssetsService.uploadFile,
						deleteFile: AssetsService.deleteFile,
					},
					getContentPageByPathEndpoint: `${publicRuntimeConfig.PROXY_URL}/admin/content-pages`,
				},
				database: {
					databaseApplicationType: DatabaseType.hetArchief,
					proxyUrl: publicRuntimeConfig.PROXY_URL,
				},
				flowplayer: {
					FLOW_PLAYER_ID: publicRuntimeConfig.FLOW_PLAYER_ID,
					FLOW_PLAYER_TOKEN: publicRuntimeConfig.FLOW_PLAYER_TOKEN,
				},
				handlers: {
					onExternalLink: () => {
						// Client decides what should happen when an external link is clicked
					},
				},
				user: commonUser,
				routes: ADMIN_CORE_ROUTES as any, // TODO: remove any when the routes record becomes a partial in admin-core
				env: {},
			};
			AdminConfigManager.setConfig(config);
			setAdminCoreConfig(config);
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			initConfigValue();
		}, [initConfigValue]);

		if (!adminCoreConfig && isBrowser()) {
			return (
				<div suppressHydrationWarning={true}>
					<Loading fullscreen owner="admin-core config not set yet" />
				</div>
			);
		}

		return <WrappedComponent {...props} />;
	};
};
