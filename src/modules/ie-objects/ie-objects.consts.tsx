import { type MenuItemInfo, type TabProps } from '@meemoo/react-components';
import { compact, isNil } from 'lodash-es';
import Link from 'next/link';
import React, { type ReactNode } from 'react';

import {
	type ActionItem,
	type DynamicActionMenuProps,
} from '@ie-objects/components/DynamicActionMenu';
import { type MetadataItem } from '@ie-objects/components/Metadata';
import { type ObjectPlaceholderProps } from '@ie-objects/components/ObjectPlaceholder';
import { objectPlaceholderMock } from '@ie-objects/components/ObjectPlaceholder/__mocks__/object-placeholder';
import {
	type IeObject,
	type IeObjectFile,
	type IsPartOfCollection,
	IsPartOfKey,
	MediaActions,
	MetadataExportFormats,
	type MetadataSortMap,
	ObjectDetailTabs,
} from '@ie-objects/ie-objects.types';
import {
	mapArrayToMetadataData,
	mapObjectsToMetadata,
	mapObjectToMetadata,
} from '@ie-objects/utils/map-metadata';
import type { SimplifiedAlto } from '@iiif-viewer/IiifViewer.types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight, IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import {
	GET_TYPE_TO_LABEL_MAP,
	TYPE_TO_ICON_MAP,
	TYPE_TO_NO_ICON_MAP,
} from '@shared/components/MediaCard';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { IeObjectType } from '@shared/types/ie-objects';
import { asDate, formatLongDate } from '@shared/utils/dates';
import { type Locale } from '@shared/utils/i18n';
import {
	type LanguageCode,
	LANGUAGES,
} from '@visitor-space/components/LanguageFilterForm/languages';

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
	// 'audio/mpeg', // We want to play the audio file, not the mp4 video with the ugly speaker
	'audio/mp4',
	'audio/m4a',
	'audio/aac',
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
export const IMAGE_API_FORMATS: string[] = ['image/jph'];
export const IMAGE_BROWSE_COPY_FORMATS: string[] = ['image/jpeg'];
export const XML_FORMATS: string[] = ['application/xml'];

export const METADATA_EXPORT_OPTIONS = (): MenuItemInfo[] => [
	{
		label: tText('Download alle paginas (zip)'),
		id: MetadataExportFormats.fullNewspaperZip,
	},
	{
		label: tText('Download deze pagina (zip)'),
		id: MetadataExportFormats.onePageNewspaperZip,
	},
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

/**
 * Object placeholders
 */
export const ticketErrorPlaceholder = (): ObjectPlaceholderProps => ({
	description: tHtml('modules/ie-objects/const/index___ophalen-van-afspeel-token-mislukt'),
	reasonTitle: tText('modules/ie-objects/const/index___waarom-kan-ik-dit-object-niet-bekijken'),
	reasonDescription: tHtml(
		'modules/ie-objects/const/index___er-ging-iets-mis-bij-het-ophalen-van-het-afspeel-token'
	),
	openModalButtonLabel: tText(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___meer-info'
	),
	closeModalButtonLabel: tText(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'
	),
});

export const objectPlaceholder = (): ObjectPlaceholderProps => ({
	...objectPlaceholderMock,
	openModalButtonLabel: tText(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___meer-info'
	),
	closeModalButtonLabel: tText(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'
	),
});

export const noLicensePlaceholder = (): ObjectPlaceholderProps => ({
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
	closeModalButtonLabel: tText(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'
	),
});

/**
 * Tabs
 */

export const OBJECT_DETAIL_TABS = (
	mediaType: IeObjectType | null,
	activeTab?: ObjectDetailTabs,
	mediaAvailable = true
): TabProps[] => {
	const typeWithDefault = mediaType || IeObjectType.Video;
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
			icon: (
				<Icon
					name={
						mediaAvailable
							? TYPE_TO_ICON_MAP[typeWithDefault]
							: TYPE_TO_NO_ICON_MAP[typeWithDefault]
					}
					aria-hidden
				/>
			),
			active: ObjectDetailTabs.Media === activeTab,
		},
		...(typeWithDefault === IeObjectType.Newspaper
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

export const KIOSK_ACTION_SORT_MAP = (): MetadataSortMap[] => [];

export const ANONYMOUS_ACTION_SORT_MAP = (): MetadataSortMap[] => [
	{ id: MediaActions.RequestMaterial, isPrimary: true },
	{ id: MediaActions.Bookmark },
	{ id: MediaActions.Report },
	{ id: MediaActions.ToggleHighlightSearchTerm },
];

export const VISITOR_ACTION_SORT_MAP = (
	hasAccessToVisitorSpaceOfObject: boolean
): MetadataSortMap[] => [
	...(hasAccessToVisitorSpaceOfObject ? [{ id: MediaActions.Export, isPrimary: true }] : []),
	{ id: MediaActions.RequestMaterial, isPrimary: !hasAccessToVisitorSpaceOfObject },
	{ id: MediaActions.Bookmark },
	{ id: MediaActions.Report },
	{ id: MediaActions.ToggleHighlightSearchTerm },
];

export const KEY_USER_ACTION_SORT_MAP = (
	hasAccessToVisitorSpaceOfObject: boolean
): MetadataSortMap[] => [
	...(hasAccessToVisitorSpaceOfObject ? [{ id: MediaActions.Export, isPrimary: true }] : []),
	{ id: MediaActions.RequestMaterial, isPrimary: !hasAccessToVisitorSpaceOfObject },
	{ id: MediaActions.Bookmark },
	{ id: MediaActions.Report },
	{ id: MediaActions.ToggleHighlightSearchTerm },
];

export const MEEMOO_ADMIN_ACTION_SORT_MAP = (
	hasAccessToVisitorSpaceOfObject: boolean
): MetadataSortMap[] => [
	...(hasAccessToVisitorSpaceOfObject ? [{ id: MediaActions.Export, isPrimary: true }] : []),
	{ id: MediaActions.RequestMaterial, isPrimary: !hasAccessToVisitorSpaceOfObject },
	{ id: MediaActions.Bookmark },
	{ id: MediaActions.Report },
	{ id: MediaActions.ToggleHighlightSearchTerm },
];

export const CP_ADMIN_ACTION_SORT_MAP = (
	hasAccessToVisitorSpaceOfObject: boolean
): MetadataSortMap[] => [
	{ id: MediaActions.RequestMaterial, isPrimary: true },
	...(hasAccessToVisitorSpaceOfObject ? [{ id: MediaActions.Export }] : []),
	{ id: MediaActions.Bookmark },
	{ id: MediaActions.Report },
	{ id: MediaActions.ToggleHighlightSearchTerm },
];

export const MEDIA_ACTIONS = ({
	isMobile,
	canManageFolders,
	isInAFolder,
	isHighlightSearchTermActive,
	canToggleSearchTerms,
	canReport,
	canRequestAccess,
	canRequestMaterial,
	canExport,
	externalFormUrl,
}: {
	isMobile: boolean;
	canManageFolders: boolean;
	isInAFolder: boolean;
	isHighlightSearchTermActive: boolean;
	canToggleSearchTerms: boolean;
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
	const toggleHighlightSearchTermsLabel = isHighlightSearchTermActive
		? tText('modules/ie-objects/ie-objects___verberg-gemarkeerde-zoektermen')
		: tText('modules/ie-objects/ie-objects___toon-gemarkeerde-zoektermen');
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
			...((canToggleSearchTerms
				? [
						{
							label: toggleHighlightSearchTermsLabel,
							icon: (
								<Icon
									aria-hidden
									className="u-font-size-24 u-text-left"
									name={
										isHighlightSearchTermActive
											? IconNamesLight.NoMarker
											: IconNamesLight.Marker
									}
								/>
							),
							id: MediaActions.ToggleHighlightSearchTerm,
							ariaLabel: toggleHighlightSearchTermsLabel,
							tooltip: toggleHighlightSearchTermsLabel,
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

const getOcrMetadataFields = (simplifiedAlto: SimplifiedAlto | null): MetadataItem[] => {
	const metadataFields: MetadataItem[] = [];
	if (simplifiedAlto) {
		if (simplifiedAlto.description.softwareName) {
			metadataFields.push({
				title: tText('OCR Software'),
				data: simplifiedAlto.description.softwareName,
			});
		}
		if (simplifiedAlto.description.softwareVersion) {
			metadataFields.push({
				title: tText('OCR Software version'),
				data: simplifiedAlto.description.softwareVersion,
			});
		}
		if (simplifiedAlto.description.softwareCreator) {
			metadataFields.push({
				title: tText('OCR Software maker'),
				data: simplifiedAlto.description.softwareCreator,
			});
		}
		if (simplifiedAlto.description.softwareCreator) {
			metadataFields.push({
				title: tText('OCR Software maker'),
				data: simplifiedAlto.description.softwareCreator,
			});
		}
		if (simplifiedAlto.description.processingDateTime) {
			metadataFields.push({
				title: tText('OCR gemaakt op'),
				data: simplifiedAlto.description.processingDateTime,
			});
		}
		if (simplifiedAlto.description.processingStepSettings) {
			metadataFields.push({
				title: tText('OCR betrouwbaarheid'),
				data: simplifiedAlto.description.processingStepSettings,
			});
		}
	}
	return metadataFields;
};

function renderAbrahamLink(
	abrahamInfo: { id: string; uri: string; code: string } | undefined
): ReactNode | null {
	if (!abrahamInfo) {
		return null;
	}
	if (abrahamInfo.uri && abrahamInfo.id) {
		return (
			<Link href={abrahamInfo?.uri} passHref>
				<a>{abrahamInfo?.id}</a>
			</Link>
		);
	}
	if (abrahamInfo?.id) {
		return abrahamInfo.id;
	}
	if (abrahamInfo?.uri) {
		return (
			<Link href={abrahamInfo?.uri} passHref>
				<a>{abrahamInfo?.uri}</a>
			</Link>
		);
	}
}

function renderIsPartOfValue(
	isPartOfEntries: IsPartOfCollection[] | undefined,
	key: IsPartOfKey
): string | null {
	const value = isPartOfEntries?.find((isPartOfEntry) => isPartOfEntry.collectionType === key);
	return value?.name || null;
}

function renderDate(date: string | null | undefined): string | null {
	if (!date) {
		return null;
	}
	return formatLongDate(asDate(date));
}

export const GET_METADATA_FIELDS = (
	mediaInfo: IeObject,
	activeFile: IeObjectFile | undefined,
	simplifiedAlto: SimplifiedAlto | null,
	locale: Locale,
	clientUrl: string
): MetadataItem[] => {
	return [
		{
			title: tText('Titel van de reeks'),
			data: mediaInfo.collectionName,
		},
		{
			title: tText('Editie nummer'),
			data: mediaInfo.issueNumber,
		},
		{
			title: tText('modules/ie-objects/const/index___pid'),
			data: mediaInfo.schemaIdentifier,
		},
		...mapObjectsToMetadata(mediaInfo.premisIdentifier),
		{
			title: tText('modules/ie-objects/const/index___identifier-bij-aanbieder'),
			data: mediaInfo.meemooLocalId,
		},
		{
			title: tText('Permanente URL'),
			data:
				clientUrl +
				ROUTES_BY_LOCALE[locale].permalink.replace(':pid', mediaInfo.schemaIdentifier),
		},
		{
			title: tText('modules/ie-objects/const/index___creatiedatum'),
			data: mediaInfo.dateCreated,
		},
		{
			title: tText('modules/ie-objects/const/index___publicatiedatum'),
			data: renderDate(mediaInfo.datePublished),
		},
		{
			title: tText('Datum toegevoegd aan platform'),
			data: renderDate(activeFile?.createdAt),
		},
		{
			title: tText("Aantal pagina's"),
			data: isNil(mediaInfo?.numberOfPages) ? null : String(mediaInfo.numberOfPages),
		},
		{
			title: tText('modules/ie-objects/const/index___taal'),
			data: mapArrayToMetadataData(
				mediaInfo.inLanguage?.map(
					(languageCode) =>
						LANGUAGES[locale][languageCode as LanguageCode] || languageCode
				)
			),
		},
		{
			title: tText('Abraham ID'),
			data: renderAbrahamLink(mediaInfo?.abrahamInfo),
		},
		{
			title: tText('Code nummer'),
			data: mediaInfo?.abrahamInfo?.code,
		},
		{
			title: tText('Bronvermelding'),
			data: mediaInfo?.creditText,
		},
		{
			title: tText('Rechtenstatus'),
			data: mediaInfo?.copyrightNotice,
		},
		{
			title: tText('Categorie'),
			data: mapArrayToMetadataData(mediaInfo.genre),
		},
		{
			title: tText('modules/ie-objects/const/index___locatie-van-de-inhoud'),
			data: mapArrayToMetadataData(mediaInfo.spatial),
		},
		{
			title: tText('modules/ie-objects/const/index___tijdsperiode-van-de-inhoud'),
			data: mapArrayToMetadataData(mediaInfo.temporal),
		},
		...mapObjectToMetadata(mediaInfo.creator),
		...mapObjectToMetadata(mediaInfo.publisher),
		{
			title: tText('modules/ie-objects/const/index___uitgebreide-beschrijving'),
			data: mediaInfo?.abstract ? mediaInfo?.abstract : null,
		},
		{
			title: tText('Transcriptie'),
			data: mediaInfo?.transcript,
		},
		{
			title: tText('Alternatieve titels'),
			data: mapArrayToMetadataData(mediaInfo.alternativeTitle),
		},
		{
			title: tText('Gerelateerde titels'),
			data: mapArrayToMetadataData([
				...(mediaInfo?.preceededBy || []),
				...(mediaInfo?.succeededBy || []),
			]),
		},
		{
			title: tText('Paginanummer'),
			data: '', // TODO https://meemoo.atlassian.net/browse/ARC-2163
		},
		{
			title: tText('Publicatietype'),
			data: '', // TODO https://meemoo.atlassian.net/browse/ARC-2163
		},
		{
			title: tText('Afmetingen (in cm)'),
			data:
				(mediaInfo?.width ? tText('Breedte: ') + mediaInfo?.width + 'cm' : '') +
					(mediaInfo?.height ? ' ' + tText('Hoogte: ') + mediaInfo?.height + 'cm' : '') ||
				null,
		},
		{
			title: tText('Digitaliseringsdatum'),
			data: '', // TODO https://meemoo.atlassian.net/browse/ARC-2163
		},
		{
			title: tText('Scanresolutie'),
			data: '', // TODO https://meemoo.atlassian.net/browse/ARC-2163
		},
		{
			title: tText('Scanmethoden'),
			data: '', // TODO https://meemoo.atlassian.net/browse/ARC-2163
		},
		{
			title: tText('Programmabeschrijving'),
			data: mediaInfo.synopsis,
		},
		{
			title: tText('Plaats van uitgave'),
			data: mediaInfo.locationCreated,
		},
		{
			title: tText('Periode van uitgave'),
			data: compact([mediaInfo.startDate, mediaInfo.endDate]).join(' - '),
		},
		{
			title: tText('Uitgevers van krant'),
			data: mediaInfo?.newspaperPublisher,
		},
		{
			title: tText('Auteursrechthouder'),
			data: mediaInfo?.copyrightHolder,
		},
		{
			title: tText('modules/ie-objects/const/index___oorsprong'),
			data: mediaInfo.meemooOriginalCp,
		},
		{
			title: tText('modules/ie-objects/const/index___archief'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.archief),
		},
		{
			title: tText('modules/ie-objects/const/index___deelarchief'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.deelarchief),
		},
		{
			title: tText('modules/ie-objects/const/index___deelreeks'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.deelreeks),
		},
		{
			title: tText('modules/ie-objects/const/index___programma'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.programma),
		},
		{
			title: tText('modules/ie-objects/const/index___reeks'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.reeks),
		},
		{
			title: tText('modules/ie-objects/const/index___seizoenen'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.seizoen),
		},
		{
			title: tText('modules/ie-objects/const/index___serie'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.serie),
		},
		{
			title: tText('modules/ie-objects/const/index___stuk'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.stuk),
		},
		{
			title: tText('modules/ie-objects/const/index___episode'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.episode),
		},
		{
			title: tText('modules/ie-objects/const/index___aflevering'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.aflevering),
		},
		{
			title: tText('modules/ie-objects/const/index___bestanddeel'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.bestanddeel),
		},
		{
			title: tText('modules/ie-objects/const/index___registratie'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.registratie),
		},
		{
			title: tText('modules/ie-objects/const/index___serienummer'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.serienummer),
		},
		{
			title: tText('modules/ie-objects/const/index___seizoennummer'),
			data: renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.seizoennummer),
		},
		{
			title: tText('Fysieke drager'),
			data: mapArrayToMetadataData(mediaInfo.dctermsMedium),
		},
		{
			title: tText('Media type'),
			data: mediaInfo.dctermsFormat,
		},
		{
			title: tText('Bestandstype'),
			data: activeFile?.mimeType,
		},
		{
			title: tText('Bestandsnaam'),
			data: activeFile?.name,
		},
		{
			title: tText('modules/ie-objects/const/index___objecttype'),
			data: mediaInfo.ebucoreObjectType,
		},
		{
			title: tText('modules/ie-objects/const/index___duurtijd'),
			data: mediaInfo.duration,
		},
		{
			title: tText('modules/ie-objects/const/index___cast'),
			data: mediaInfo.meemooDescriptionCast,
		},
		...getOcrMetadataFields(simplifiedAlto),
	];
};
