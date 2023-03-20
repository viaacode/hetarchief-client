import { MenuItemInfo, TabProps } from '@meemoo/react-components';

import { ActionItem, MetadataItem, ObjectPlaceholderProps } from '@ie-objects/components';
import { objectPlaceholderMock } from '@ie-objects/components/ObjectPlaceholder/__mocks__/object-placeholder';
import { IeObject, MediaActions, MetadataExportFormats, ObjectDetailTabs } from '@ie-objects/types';
import {
	mapArrayToMetadataData,
	mapBooleanToMetadataData,
	mapObjectToMetadata,
} from '@ie-objects/utils';
import { Icon, IconNamesLight, IconNamesSolid, TextWithNewLines } from '@shared/components';
import { tHtml, tText } from '@shared/helpers/translate';
import { IeObjectTypes } from '@shared/types';
import { asDate, formatLongDate } from '@shared/utils';

import { DynamicActionMenuProps } from '../components/DynamicActionMenu';

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

export const formatErrorPlaceholder = (format: string): ObjectPlaceholderProps => ({
	description: tText(
		'modules/ie-objects/const/index___dit-formaat-wordt-niet-ondersteund-format',
		{
			format,
		}
	),
	reasonTitle: tText('modules/ie-objects/const/index___waarom-kan-ik-dit-object-niet-bekijken'),
	reasonDescription: tText(
		'modules/ie-objects/const/index___het-formaat-van-de-data-wordt-op-dit-moment-niet-ondersteund'
	),
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

export const MEDIA_ACTIONS = (
	canManageFolders: boolean,
	isInAFolder: boolean,
	canRequestAccess: boolean
): DynamicActionMenuProps => ({
	actions: [
		...((canManageFolders
			? [
					{
						label: tText('modules/ie-objects/const/index___bookmark'),
						icon: (
							<Icon
								aria-hidden
								className="u-font-size-24 u-text-left"
								name={
									isInAFolder ? IconNamesSolid.Bookmark : IconNamesLight.Bookmark
								}
							/>
						),
						id: MediaActions.Bookmark,
						ariaLabel: tText('modules/ie-objects/const/index___bookmark'),
						tooltip: tText('modules/ie-objects/const/index___bookmark'),
					},
			  ]
			: []) as ActionItem[]),
		...((canRequestAccess
			? [
					{
						label: tText('modules/ie-objects/const/index___request'),
						icon: (
							<Icon
								aria-hidden
								className="u-font-size-24 u-text-left"
								name={isInAFolder ? IconNamesSolid.Request : IconNamesLight.Request}
							/>
						),
						id: MediaActions.RequestAccess,
						ariaLabel: tText('modules/ie-objects/const/index___request-access'),
						tooltip: tText('modules/ie-objects/const/index___request-access'),
					},
			  ]
			: []) as ActionItem[]),
	],
	limit: 2,
	onClickAction: () => null,
});

/**
 * Metadata
 */

// TODO: complete mapping
export const METADATA_FIELDS = (mediaInfo: IeObject): MetadataItem[] =>
	[
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
			title: tText('modules/ie-objects/const/index___serie'),
			data: mapArrayToMetadataData(mediaInfo.series),
		},
		{
			title: tText('modules/ie-objects/const/index___programma'),
			data: mapArrayToMetadataData(mediaInfo.program),
		},
		{
			title: tText('modules/ie-objects/const/index___alternatieve-naam'),
			data: mapArrayToMetadataData(mediaInfo.alternativeName),
		},
		// TODO: check if these are still needed
		// {
		// 	title: tText('modules/ie-objects/const/index___archief'),
		// 	data: mapArrayToMetadataData(mediaInfo.partOfArchive),
		// },
		// {
		// 	title: tText('modules/ie-objects/const/index___serie'),
		// 	data: mapArrayToMetadataData(mediaInfo.partOfSeries),
		// },
		// {
		// 	title: tText('modules/ie-objects/const/index___episode'),
		// 	data: mapArrayToMetadataData(mediaInfo.partOfEpisode),
		// },
		// {
		// 	title: tText('modules/ie-objects/const/index___seizoen'),
		// 	data: mapArrayToMetadataData(mediaInfo.partOfSeason),
		// },
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
		...mapObjectToMetadata(mediaInfo.actor),
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
			data: mediaInfo?.abstract ? (
				<TextWithNewLines text={mediaInfo?.abstract} className="u-color-neutral" />
			) : null,
		},
	].filter((field) => !!field.data);
