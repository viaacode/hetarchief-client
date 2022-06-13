import {
	AvoOrHetArchief,
	CommonUser,
	Config,
	ConfigValue,
	ContentBlockType,
	LinkInfo,
	ToastInfo,
} from '@meemoo/react-admin';
import { i18n } from 'next-i18next';
import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentType, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { PermissionsService, UserGroupsService } from '@admin/services';
import { selectUser } from '@auth/store/user';
import { navigationService } from '@navigation/services/navigation-service';
import { sortingIcons } from '@shared/components';
import Loading from '@shared/components/Loading/Loading';
import { ROUTE_PARTS } from '@shared/const';
import { AssetsService } from '@shared/services/assets-service/assets.service';
import { toastService } from '@shared/services/toast-service';

const InternalLink = (linkInfo: LinkInfo) => {
	const { to, ...rest } = linkInfo;
	return (
		<Link href={to} passHref>
			<a {...rest} />
		</Link>
	);
};

const { publicRuntimeConfig } = getConfig();

export const withAdminCoreConfig = (WrappedComponent: ComponentType): ComponentType => {
	return function withAdminCoreConfig(props: Record<string, unknown>) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [adminCoreConfig, setAdminCoreConfig] = useState<ConfigValue | null>(null);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const user = useSelector(selectUser);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const router = useRouter();

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const initConfigValue = useCallback(() => {
			if (!i18n) {
				return;
			}

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
				permissions: user?.permissions,
			};

			const config: ConfigValue = {
				navigation: {
					service: navigationService,
					views: {
						overview: {
							labels: { tableHeads: {} },
						},
					},
				},
				staticPages: [
					'/',
					'/404',
					`/${ROUTE_PARTS.account}/${ROUTE_PARTS.myHistory}`,
					`/${ROUTE_PARTS.account}/${ROUTE_PARTS.myProfile}`,
					`/${ROUTE_PARTS.account}/${ROUTE_PARTS.myFolders}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitRequests}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitors}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitorSpaces}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userManagement}/${ROUTE_PARTS.users}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userManagement}/${ROUTE_PARTS.permissions}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}`,
					`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
					`/${ROUTE_PARTS.beheer}/${ROUTE_PARTS.visitRequests}`,
					`/${ROUTE_PARTS.beheer}/${ROUTE_PARTS.visitors}`,
					`/${ROUTE_PARTS.beheer}/${ROUTE_PARTS.settings}`,
					`/${ROUTE_PARTS.cookiePolicy}`,
					`/${ROUTE_PARTS.userPolicy}`,
					`/${ROUTE_PARTS.logout}`,
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
				},
				icon: {
					component: ({ name }: { name: string }) => <span>{name}</span>,
					componentProps: {
						add: { name: 'add' },
						view: { name: 'view' },
						angleDown: { name: 'down' },
						angleUp: { name: 'up' },
						delete: { name: 'delete' },
						edit: { name: 'edit' },
					},
					list: [],
				},
				components: {
					loader: {
						component: () => <Loading fullscreen />,
					},
					table: {
						sortingIcons,
					},
				},
				services: {
					toastService: {
						showToast: (toastInfo: ToastInfo) => {
							toastService.notify({
								title: toastInfo.title,
								description: toastInfo.description,
							});
						},
					},
					i18n,
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
						}), //useRouter,
						useParams: () => {
							return router.query as Record<string, string>;
						},
					},
					queryCache: {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						clear: async (_key: string) => Promise.resolve(),
					},
					UserGroupsService,
					PermissionsService,
					assetService: AssetsService,
				},
				database: {
					databaseApplicationType: AvoOrHetArchief.hetArchief,
					graphqlUrl: publicRuntimeConfig.GRAPHQL_URL,
					graphqlSecret: '',
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
			};
			Config.setConfig(config);
			setAdminCoreConfig(config);
		}, []);

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			initConfigValue();
		}, [initConfigValue]);

		if (!adminCoreConfig) {
			return <Loading fullscreen />;
		}

		return <WrappedComponent {...props} />;
	};
};
