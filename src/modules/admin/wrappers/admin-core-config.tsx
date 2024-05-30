import {
	AdminConfig,
	ContentBlockType,
	ContentPageInfo,
	ContentWidth,
	LinkInfo,
	ToastInfo,
} from '@meemoo/admin-core-ui';
import { DatabaseType } from '@viaa/avo2-types';
import getConfig from 'next/config';
import Link from 'next/link';
import { NextRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { FunctionComponent } from 'react';

import { NAVIGATION_DROPDOWN } from '@navigation/components';
import {
	ALERT_ICON_LIST_CONFIG,
	Icon,
	ICON_LIST_CONFIG,
	IconName,
	IconNamesLight,
} from '@shared/components';
import Loading from '@shared/components/Loading/Loading';
import { ADMIN_CORE_ROUTES_BY_LOCALE, ROUTES_BY_LOCALE } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { ApiService } from '@shared/services/api-service';
import { toastService } from '@shared/services/toast-service';
import { isBrowser, Locale } from '@shared/utils';

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

// When a content page is saved, for clear the Next.js cache
const onSaveContentPage = async (contentPageInfo: ContentPageInfo) => {
	await ApiService.getApi(false).post(
		stringifyUrl({
			url: 'client-cache/clear-cache',
			query: { language: contentPageInfo.language, path: contentPageInfo.path },
		})
	);
};

export function getAdminCoreConfig(router: NextRouter, locale: Locale): AdminConfig {
	return {
		staticPages: Object.fromEntries(
			Object.keys(ROUTES_BY_LOCALE).map((language) => [
				language,
				Object.values(ROUTES_BY_LOCALE[language as Locale]),
			])
		) as Record<Locale, string[]>,
		contentPage: {
			availableContentBlocks: [
				ContentBlockType.Buttons,
				ContentBlockType.CardsWithoutDescription,
				ContentBlockType.Heading,
				ContentBlockType.HetArchiefHeaderSearch,
				ContentBlockType.IFrame,
				ContentBlockType.Image,
				ContentBlockType.ImageGrid,
				ContentBlockType.ImageTextBackground,
				ContentBlockType.Intro,
				ContentBlockType.MaintainersGrid,
				ContentBlockType.PageOverview,
				ContentBlockType.Quote,
				ContentBlockType.RichText,
				ContentBlockType.RichTextTwoColumns,
				ContentBlockType.TagsWithLink,
				ContentBlockType.ThreeClickableTiles,
				ContentBlockType.UspGrid,
				ContentBlockType.OverviewNewspaperTitles,
				ContentBlockType.ContentEncloseGrid,
			],
			defaultPageWidth: ContentWidth.LARGE,
			onSaveContentPage,
		},
		navigationBars: {
			enableIcons: true,
			customNavigationElements: [NAVIGATION_DROPDOWN.VISITOR_SPACES],
		},
		icon: {
			component: ({ name }: { name: string }) => <Icon name={name as IconName} />,
			componentProps: {
				add: { name: IconNamesLight.Plus },
				angleDown: { name: IconNamesLight.AngleDown },
				angleLeft: { name: IconNamesLight.AngleLeft },
				angleRight: { name: IconNamesLight.AngleRight },
				angleUp: { name: IconNamesLight.AngleUp },
				arrowDown: { name: IconNamesLight.ArrowDown },
				arrowRight: { name: IconNamesLight.ArrowRight },
				arrowUp: { name: IconNamesLight.ArrowUp },
				calendar: { name: IconNamesLight.Calendar },
				check: { name: IconNamesLight.Check },
				chevronLeft: { name: IconNamesLight.AngleLeft },
				clock: { name: IconNamesLight.Clock },
				copy: { name: IconNamesLight.Copy },
				delete: { name: IconNamesLight.Trash },
				edit: { name: IconNamesLight.Edit },
				export: { name: IconNamesLight.Export },
				extraOptions: { name: IconNamesLight.DotsVertical },
				filter: { name: IconNamesLight.Search },
				info: { name: IconNamesLight.Info },
				sortTable: { name: IconNamesLight.SortTable },
				view: { name: IconNamesLight.Show },
				warning: { name: IconNamesLight.Exclamation },
				eyeOff: { name: IconNamesLight.Hide },
				audio: { name: IconNamesLight.Audio },
				video: { name: IconNamesLight.Video },
				newspaper: { name: IconNamesLight.Newspaper },
			},
			list: ICON_LIST_CONFIG,
			alerts: ALERT_ICON_LIST_CONFIG,
		},
		components: {
			defaultAudioStill: '/images/waveform.svg',
			loader: {
				component: () => <Loading fullscreen owner="admin-core-loader" />,
			},
			buttonTypes: () => [
				{
					label: tText('modules/admin/wrappers/with-admin-core-config___zilver'),
					value: 'content-page-button--silver',
				},
				{
					label: tText('modules/admin/wrappers/with-admin-core-config___blauw-groen'),
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
				showToast: (toastInfo: ToastInfo): string => {
					return toastService.notify({
						title: toastInfo.title,
						description: toastInfo.description,
					});
				},
				hideToast: (id: string) => {
					toastService.dismiss(id);
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
			getContentPageByLanguageAndPathEndpoint: null,
		},
		database: {
			databaseApplicationType: DatabaseType.hetArchief,
			proxyUrl: isBrowser() ? publicRuntimeConfig.PROXY_URL : process.env.PROXY_URL,
		},
		flowplayer: {
			FLOW_PLAYER_ID: isBrowser()
				? publicRuntimeConfig.FLOW_PLAYER_ID
				: process.env.FLOW_PLAYER_ID,
			FLOW_PLAYER_TOKEN: isBrowser()
				? publicRuntimeConfig.FLOW_PLAYER_TOKEN
				: process.env.FLOW_PLAYER_TOKEN,
		},
		handlers: {
			onExternalLink: () => {
				// Client decides what should happen when an external link is clicked
			},
		},
		routes: ADMIN_CORE_ROUTES_BY_LOCALE[locale],
		locale: locale as any,
		env: {
			CLIENT_URL: publicRuntimeConfig.CLIENT_URL,
		},
	};
}
