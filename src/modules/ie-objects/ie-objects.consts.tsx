import { MenuItemInfo, TabProps } from '@meemoo/react-components';
import { isString } from 'lodash-es';
import { StringParam } from 'use-query-params';

import {
	ActionItem,
	DynamicActionMenuProps,
	MetadataItem,
	ObjectPlaceholderProps,
} from '@ie-objects/components';
import { objectPlaceholderMock } from '@ie-objects/components/ObjectPlaceholder/__mocks__/object-placeholder';
import {
	IeObject,
	MediaActions,
	MetadataExportFormats,
	MetadataSortMap,
	ObjectDetailTabs,
} from '@ie-objects/ie-objects.types';
import {
	mapArrayToMetadataData,
	mapBooleanToMetadataData,
	mapObjectToMetadata,
} from '@ie-objects/utils';
import { Icon, IconNamesLight, IconNamesSolid } from '@shared/components';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { IeObjectTypes } from '@shared/types';
import { asDate, formatLongDate } from '@shared/utils';

/**
 * Render media
 */

export const FLOWPLAYER_VIDEO_FORMATS: string[] = ['mp4', 'ogv', 'webm', 'm3u8'];
export const FLOWPLAYER_AUDIO_FORMATS: string[] = ['mp3', 'm4a', 'aac'];
export const FLOWPLAYER_FORMATS: string[] = [
	...FLOWPLAYER_VIDEO_FORMATS,
	...FLOWPLAYER_AUDIO_FORMATS,
];
export const IMAGE_FORMATS: string[] = ['png', 'jpg', 'jpeg', 'gif'];

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

const renderMediaTab = (type?: IeObjectTypes, available = true) => {
	switch (type) {
		case 'audio':
			return {
				id: ObjectDetailTabs.Media,
				label: tText('modules/ie-objects/const/index___audio'),
				icon: (
					<Icon
						name={available ? IconNamesLight.Audio : IconNamesLight.NoAudio}
						aria-hidden
					/>
				),
			};
		case 'video':
		case 'film':
			return {
				id: ObjectDetailTabs.Media,
				label: tText('modules/ie-objects/const/index___video'),
				icon: (
					<Icon
						name={available ? IconNamesLight.Video : IconNamesLight.NoVideo}
						aria-hidden
					/>
				),
			};
		default:
			return {
				id: ObjectDetailTabs.Media,
				label: tText('modules/ie-objects/const/index___video'),
				icon: <Icon name={IconNamesLight.NoVideo} aria-hidden />,
			};
	}
};

export const OBJECT_DETAIL_TABS = (mediaType?: IeObjectTypes, available = true): TabProps[] => [
	{
		id: ObjectDetailTabs.Metadata,
		label: tText('modules/ie-objects/const/index___metadata'),
		icon: <Icon name={IconNamesLight.Info} aria-hidden />,
	},
	renderMediaTab(mediaType, available),
];

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
		? tText('Verberg gemarkeerde zoektermen')
		: tText('Toon gemarkeerde zoektermen');
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

// TODO: complete mapping
export const METADATA_FIELDS = (mediaInfo: IeObject): MetadataItem[] => [
	{
		title: tText('modules/ie-objects/const/index___oorsprong'),
		data: mediaInfo.meemooOriginalCp,
	},
	{
		title: tText('modules/ie-objects/const/index___meemoo-identifier'),
		data: mediaInfo.meemooIdentifier,
	},
	{
		title: tText('modules/ie-objects/const/index___pid'),
		data: mediaInfo.premisIsPartOf,
	},
	{
		title: tText('modules/ie-objects/const/index___identifier-bij-aanbieder'),
		data: mediaInfo.meemooLocalId,
	},
	...mapObjectToMetadata(mediaInfo.premisIdentifier),
	{
		title: tText('modules/ie-objects/const/index___alternatieve-naam'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.alternatief),
	},
	{
		title: tText('modules/ie-objects/const/index___archief'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.archief),
	},
	{
		title: tText('modules/ie-objects/const/index___deelarchief'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.deelarchief),
	},
	{
		title: tText('modules/ie-objects/const/index___deelreeks'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.deelreeks),
	},
	{
		title: tText('modules/ie-objects/const/index___programma'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.programma),
	},
	{
		title: tText('modules/ie-objects/const/index___reeks'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.reeks),
	},
	{
		title: tText('modules/ie-objects/const/index___seizoenen'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.seizoen),
	},
	{
		title: tText('modules/ie-objects/const/index___serie'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.serie),
	},
	{
		title: tText('modules/ie-objects/const/index___stuk'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.stuk),
	},
	{
		title: tText('modules/ie-objects/const/index___episode'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.episode),
	},
	{
		title: tText('modules/ie-objects/const/index___aflevering'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.aflevering),
	},
	{
		title: tText('modules/ie-objects/const/index___bestanddeel'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.bestanddeel),
	},
	{
		title: tText('modules/ie-objects/const/index___registratie'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.registratie),
	},
	{
		title: tText('modules/ie-objects/const/index___serienummer'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.serienummer),
	},
	{
		title: tText('modules/ie-objects/const/index___seizoennummer'),
		data: mapArrayToMetadataData(mediaInfo.isPartOf?.seizoennummer),
	},
	{
		title: tText('modules/ie-objects/const/index___bestandstype'),
		data: mediaInfo.dctermsFormat,
	},
	{
		title: tText('modules/ie-objects/const/index___analoge-drager'),
		data: mediaInfo.dctermsMedium,
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
		title: tText('modules/ie-objects/const/index___creatiedatum'),
		data: formatLongDate(asDate(mediaInfo.dateCreatedLowerBound)),
	},
	{
		title: tText('modules/ie-objects/const/index___publicatiedatum'),
		data: formatLongDate(asDate(mediaInfo.datePublished)),
	},
	...mapObjectToMetadata(mediaInfo.creator),
	...mapObjectToMetadata(mediaInfo.publisher),
	{
		title: tText('modules/ie-objects/const/index___transcriptie'),
		data: mediaInfo?.representations?.[0]?.transcript, // TODO: Update voor andere representations?
	},
	{
		title: tText('modules/ie-objects/const/index___programmabeschrijving'),
		data: mediaInfo.meemooDescriptionProgramme,
	},
	{
		title: tText('modules/ie-objects/const/index___cast'),
		data: mediaInfo.meemooDescriptionCast,
	},
	{
		title: tText('modules/ie-objects/const/index___genre'),
		data: mapArrayToMetadataData(mediaInfo.genre),
	},
	...(mediaInfo.actor
		? [
				{
					title: tText('modules/ie-objects/const/index___genre'),
					data: isString(mediaInfo.actor)
						? mediaInfo.actor
						: JSON.stringify(mediaInfo.actor),
				},
		  ]
		: []),
	{
		title: tText('modules/ie-objects/const/index___locatie-van-de-inhoud'),
		data: mapArrayToMetadataData([mediaInfo.spatial]),
	},
	{
		title: tText('modules/ie-objects/const/index___tijdsperiode-van-de-inhoud'),
		data: mapArrayToMetadataData([mediaInfo.temporal]),
	},
	{
		title: tText('modules/ie-objects/const/index___taal'),
		data: mapArrayToMetadataData(mediaInfo.inLanguage),
	},
	{
		title: tText('modules/ie-objects/const/index___filmbasis'),
		data: mediaInfo.meemoofilmBase,
	},
	{
		title: tText('modules/ie-objects/const/index___beeld-geluid'),
		data: mediaInfo.meemoofilmImageOrSound,
	},
	{
		title: tText('modules/ie-objects/const/index___kleur-zwart-wit'),
		data: mapBooleanToMetadataData(mediaInfo.meemoofilmColor),
	},
	{
		title: tText('modules/ie-objects/const/index___uitgebreide-beschrijving'),
		data: mediaInfo?.abstract ? mediaInfo?.abstract : null,
	},
];

export const IE_OBJECT_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS]: StringParam, // Comma separated string
};
