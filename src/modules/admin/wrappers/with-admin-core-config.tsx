import {
	AvoOrHetArchief,
	Config,
	ConfigValue,
	ContentBlockType,
	LinkInfo,
	ToastInfo,
} from '@meemoo/react-admin';
import { CommonUser } from '@meemoo/react-admin/dist/cjs/modules/user/user.types';
import { i18n } from 'next-i18next';
import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { useRouter } from 'next/router';
import { ComponentType, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { PermissionsService, UserGroupsService } from '@admin/services';
import { selectUser } from '@auth/store/user';
import { navigationService } from '@navigation/services/navigation-service';
import { sortingIcons } from '@shared/components';
import Loading from '@shared/components/Loading/Loading';
import { AssetsService } from '@shared/services/assets-service/assets.service';

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
				contentPage: {
					availableContentBlocks: [
						// TODO extend this list when meemoo decides which content blocks that want to use for hetarchief
						ContentBlockType.Heading,
						ContentBlockType.RichText,
						ContentBlockType.RichTextTwoColumns,
						ContentBlockType.Buttons,
						ContentBlockType.Image,
					],
				},
				icon: {
					component: ({ name }: any) => <span>{name}</span>,
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
							// Client decides how the toast messages are shown
							console.log('show toast: ', toastInfo);
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
		}, [user, setAdminCoreConfig]);

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
