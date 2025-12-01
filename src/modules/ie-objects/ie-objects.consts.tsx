import type { ActionItem, DynamicActionMenuProps } from '@ie-objects/components/DynamicActionMenu';
import type { ObjectPlaceholderProps } from '@ie-objects/components/ObjectPlaceholder';
import {
	type ButtonsSortOrder,
	IeObjectLicense,
	type IsPartOfCollection,
	type IsPartOfKey,
	MediaActions,
	MetadataExportFormats,
	ObjectDetailTabs,
} from '@ie-objects/ie-objects.types';
import type { MenuItemInfo, TabProps } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight, IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import { GET_TYPE_TO_LABEL_MAP, getIconFromObjectType } from '@shared/components/MediaCard';
import { tHtml, tText } from '@shared/helpers/translate';
import { IeObjectType } from '@shared/types/ie-objects';
import { asDate, formatLongDate } from '@shared/utils/dates';
import React, { type ReactNode } from 'react';

/**
 * Render media
 */

export const FLOWPLAYER_VIDEO_FORMATS: string[] = [
	'video/mp4',
	'video/ogv',
	'video/webm',
	'video/m3u8',
	'application/vnd.apple.mpegurl',
];
export const FLOWPLAYER_AUDIO_FORMATS: string[] = [
	// We want to play the mp4 video file with the ugly speaker (decided by team archief)
	'audio/mp4',
	// If the mp4 with ugly speaker is not available, we want to play the mp3 file
	// backend will ensure there is only one of these two formats available
	// https://meemoo.atlassian.net/browse/ARC-3121
	'audio/mpeg',
];
export const FLOWPLAYER_FORMATS: string[] = [
	...FLOWPLAYER_VIDEO_FORMATS,
	...FLOWPLAYER_AUDIO_FORMATS,
];
export const IMAGE_FORMATS: string[] = [
	'image/png',
	'image/jpeg',
	'image/gif',
	'image/tiff',
	'image/bmp',
];
export const IMAGE_API_FORMATS: string[] = ['image/jph', 'image/jp2'];
export const IMAGE_BROWSE_COPY_FORMATS: string[] = ['image/jpeg'];
export const XML_FORMATS: string[] = ['application/xml'];
export const JSON_FORMATS: string[] = ['application/json'];
export const MIN_LENGTH_SCHEMA_IDENTIFIER_V2 = 36;

export const METADATA_EXPORT_OPTIONS = (): MenuItemInfo[] => [
	{
		label: tText(
			'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata-als-XML'
		),
		id: MetadataExportFormats.xml,
	},
	{
		label: tText(
			'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata-als-CSV'
		),
		id: MetadataExportFormats.csv,
	},
];

export const GET_NEWSPAPER_DOWNLOAD_OPTIONS = (): MenuItemInfo[] => [
	{
		label: tText('modules/ie-objects/ie-objects___download-alle-paginas-zip'),
		id: MetadataExportFormats.fullNewspaperZip,
	},
	{
		label: tText('modules/ie-objects/ie-objects___download-deze-pagina-zip'),
		id: MetadataExportFormats.onePageNewspaperZip,
	},
];

/**
 * Object placeholders
 */
const getDefaultPlaceholderLabels = () => ({
	description: tText(
		'modules/ie-objects/ie-objects___je-kan-dit-object-enkel-bekijken-tijdens-een-fysiek-bezoek-aan-de-bezoekersruimte'
	),
	reasonTitle: tText('modules/ie-objects/ie-objects___waarom-kan-ik-dit-object-niet-bekijken'),
	openModalButtonLabel: tText('modules/ie-objects/ie-objects___meer-info'),
	closeModalButtonLabel: tText('modules/ie-objects/ie-objects___sluit'),
});

export const getTicketErrorPlaceholderLabels = (): ObjectPlaceholderProps => ({
	description: tHtml('modules/ie-objects/const/index___ophalen-van-afspeel-token-mislukt'),
	reasonTitle: tText('modules/ie-objects/const/index___waarom-kan-ik-dit-object-niet-bekijken'),
	reasonDescription: tHtml(
		'modules/ie-objects/const/index___er-ging-iets-mis-bij-het-ophalen-van-het-afspeel-token'
	),
	openModalButtonLabel: tText(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___meer-info'
	),
	closeModalButtonLabel: tText('pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'),
});

export const getObjectPlaceholderLabels = (): ObjectPlaceholderProps => ({
	...getDefaultPlaceholderLabels(),
	openModalButtonLabel: tText(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___meer-info'
	),
	closeModalButtonLabel: tText('pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'),
});

export const getNoLicensePlaceholderLabels = (): ObjectPlaceholderProps => ({
	description: tText(
		'modules/ie-objects/const/index___je-kan-dit-object-enkel-bekijken-tijdens-een-fysiek-bezoek-aan-de-bezoekersruimte'
	),
	reasonTitle: tText('modules/ie-objects/const/index___waarom-kan-ik-dit-object-niet-bekijken'),
	reasonDescription: tText(
		'modules/ie-objects/const/index___dit-object-bevat-geen-licentie-voor-online-raadpleging-breng-een-bezoek-aan-de-bezoekersruimte'
	),
	openModalButtonLabel: tText(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___meer-info'
	),
	closeModalButtonLabel: tText('pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'),
});

/**
 * Tabs
 */

export const OBJECT_DETAIL_TABS = (
	mediaType: IeObjectType | null,
	activeTab?: ObjectDetailTabs,
	mediaAvailable = true,
	ocrAvailable = true
): TabProps[] => {
	const typeWithDefault = mediaType || IeObjectType.VIDEO;
	return [
		{
			id: ObjectDetailTabs.Metadata,
			label: tText('modules/ie-objects/const/index___metadata'),
			icon: <Icon name={IconNamesLight.Info} aria-hidden />,
			active: ObjectDetailTabs.Metadata === activeTab,
		},
		{
			id: ObjectDetailTabs.Media,
			label: GET_TYPE_TO_LABEL_MAP(typeWithDefault),
			icon: <Icon name={getIconFromObjectType(typeWithDefault, mediaAvailable)} aria-hidden />,
			active: ObjectDetailTabs.Media === activeTab,
		},
		...(ocrAvailable
			? [
					{
						id: ObjectDetailTabs.Ocr,
						label: tText('modules/ie-objects/ie-objects___ocr'),
						icon: <Icon name={IconNamesLight.Ocr} aria-hidden />,
						active: ObjectDetailTabs.Ocr === activeTab,
					},
				]
			: []),
	];
};

/**
 * Actions
 */
// https://meemoo.atlassian.net/browse/ARC-1302 export action follows this task

function setFirstButtonAsPrimary(buttons: ButtonsSortOrder[]): ButtonsSortOrder[] {
	buttons[0].isPrimary = true;
	return buttons;
}

export const KIOSK_ACTION_SORT_MAP = (): ButtonsSortOrder[] => [];

export const ANONYMOUS_ACTION_SORT_MAP = (canExport: boolean): ButtonsSortOrder[] =>
	setFirstButtonAsPrimary([
		...(canExport ? [{ id: MediaActions.Export }] : []),
		{ id: MediaActions.RequestMaterial },
		{ id: MediaActions.Bookmark },
		{ id: MediaActions.Report },
	]);

export const VISITOR_ACTION_SORT_MAP = (canExport: boolean): ButtonsSortOrder[] =>
	setFirstButtonAsPrimary([
		...(canExport ? [{ id: MediaActions.Export }] : []),
		{ id: MediaActions.RequestMaterial },
		{ id: MediaActions.Bookmark },
		{ id: MediaActions.Report },
	]);

export const KEY_USER_ACTION_SORT_MAP = (canExport: boolean): ButtonsSortOrder[] =>
	setFirstButtonAsPrimary([
		...(canExport ? [{ id: MediaActions.Export }] : []),
		{ id: MediaActions.RequestMaterial },
		{ id: MediaActions.Bookmark },
		{ id: MediaActions.Report },
	]);

export const MEEMOO_ADMIN_ACTION_SORT_MAP = (canExport: boolean): ButtonsSortOrder[] =>
	setFirstButtonAsPrimary([
		...(canExport ? [{ id: MediaActions.Export }] : []),
		{ id: MediaActions.RequestMaterial },
		{ id: MediaActions.Bookmark },
		{ id: MediaActions.Report },
	]);

export const CP_ADMIN_ACTION_SORT_MAP = (canExport: boolean): ButtonsSortOrder[] =>
	setFirstButtonAsPrimary([
		...(canExport ? [{ id: MediaActions.Export }] : []),
		{ id: MediaActions.RequestMaterial },
		{ id: MediaActions.Bookmark },
		{ id: MediaActions.Report },
	]);

export const MEDIA_ACTIONS = ({
	isMobile,
	canManageFolders,
	isInAFolder,
	canReport,
	canRequestAccess,
	canRequestMaterial,
	canExport,
	externalFormUrl,
}: {
	isMobile: boolean;
	canManageFolders: boolean;
	isInAFolder: boolean;
	canReport: boolean;
	canRequestAccess: boolean;
	canRequestMaterial: boolean;
	canExport: boolean;
	externalFormUrl: string | null;
}): DynamicActionMenuProps => {
	const activeIconSet = isInAFolder ? IconNamesSolid : IconNamesLight;

	const addToMaterialRequestsListButtonLabelDesktop = tText(
		'modules/ie-objects/const/index___toevoegen-aan-aanvraaglijst-desktop'
	);
	const addToMaterialRequestsListButtonLabelMobile = tText(
		'modules/ie-objects/const/index___toevoegen-aan-aanvraaglijst-mobile'
	);
	const addToMaterialRequestsListButtonLabel = isMobile
		? addToMaterialRequestsListButtonLabelMobile
		: addToMaterialRequestsListButtonLabelDesktop;
	return {
		actions: [
			...((canExport
				? [
						{
							label: tText('modules/ie-objects/const/index___exporteer-metadata'),
							id: MediaActions.Export,
							ariaLabel: tText('modules/ie-objects/const/index___exporteer-metadata'),
							tooltip: tText('modules/ie-objects/const/index___exporteer-metadata'),
						},
					]
				: []) as ActionItem[]),
			...((canRequestMaterial
				? [
						{
							label: addToMaterialRequestsListButtonLabel,
							icon: (
								<Icon
									aria-hidden
									className="u-font-size-24 u-text-left"
									name={IconNamesLight.Request}
								/>
							),
							id: MediaActions.RequestMaterial,
							ariaLabel: addToMaterialRequestsListButtonLabel,
							tooltip: addToMaterialRequestsListButtonLabel,
							url: externalFormUrl,
						},
					]
				: []) as ActionItem[]),
			...((canRequestAccess
				? [
						{
							label: tText('modules/ie-objects/const/index___plan-een-bezoek'),
							icon: (
								<Icon
									aria-hidden
									className="u-font-size-24 u-text-left"
									name={activeIconSet.Request}
								/>
							),
							id: MediaActions.RequestAccess,
							ariaLabel: tText('modules/ie-objects/const/index___plan-een-bezoek'),
							tooltip: tText('modules/ie-objects/const/index___plan-een-bezoek'),
						},
					]
				: []) as ActionItem[]),
			...((canManageFolders
				? [
						{
							label: tText('modules/ie-objects/const/index___bookmark'),
							icon: (
								<Icon
									aria-hidden
									className="u-font-size-24 u-text-left"
									name={activeIconSet.Bookmark}
								/>
							),
							id: MediaActions.Bookmark,
							ariaLabel: tText('modules/ie-objects/const/index___bookmark'),
							tooltip: tText('modules/ie-objects/const/index___bookmark'),
						},
					]
				: []) as ActionItem[]),
			...((canReport
				? [
						{
							label: tText('modules/ie-objects/const/index___rapporteer'),
							icon: (
								<Icon
									aria-hidden
									className="u-font-size-24 u-text-left"
									name={IconNamesLight.Flag}
								/>
							),
							id: MediaActions.Report,
							ariaLabel: tText('modules/ie-objects/const/index___rapporteer'),
							tooltip: tText('modules/ie-objects/const/index___rapporteer'),
						},
					]
				: []) as ActionItem[]),
		],
		limit: 1,
		onClickAction: () => null,
	};
};

/**
 * Metadata
 */

export function renderAbrahamLink(
	abrahamInfo: { id: string; uri: string } | undefined
): ReactNode | null {
	if (!abrahamInfo) {
		return null;
	}
	if (abrahamInfo.uri && abrahamInfo.id) {
		return (
			<a href={abrahamInfo?.uri} target="_blank" rel="noreferrer">
				{abrahamInfo?.id}
			</a>
		);
	}
	if (abrahamInfo?.id) {
		return abrahamInfo.id;
	}
	if (abrahamInfo?.uri) {
		return (
			<a href={abrahamInfo?.uri} target="_blank" rel="noreferrer">
				{abrahamInfo?.uri}
			</a>
		);
	}
}

export function renderIsPartOfValue(
	isPartOfEntries: IsPartOfCollection[] | undefined,
	key: IsPartOfKey
): string | null {
	const value = isPartOfEntries?.find((isPartOfEntry) => isPartOfEntry.collectionType === key);
	return value?.name || null;
}

export function renderDate(date: string | null | undefined): string | null {
	if (!date) {
		return null;
	}
	return formatLongDate(asDate(date));
}

export const IE_OBJECT_INTRA_CP_LICENSES: Readonly<IeObjectLicense[]> = [
	IeObjectLicense.INTRA_CP_CONTENT,
	IeObjectLicense.INTRA_CP_METADATA_ALL,
	IeObjectLicense.INTRA_CP_METADATA_LTD,
];
