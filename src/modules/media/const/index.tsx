import { TabProps } from '@meemoo/react-components';

import { ActionItem, MetadataItem, ObjectPlaceholderProps } from '@media/components';
import { objectPlaceholderMock } from '@media/components/ObjectPlaceholder/__mocks__/object-placeholder';
import { Media, MediaActions, ObjectDetailTabs } from '@media/types';
import {
	mapArrayToMetadataData,
	mapBooleanToMetadataData,
	mapObjectToMetadata,
} from '@media/utils';
import { Icon, TextWithNewLines } from '@shared/components';
import { TranslationService } from '@shared/services/translation-service/transaltion-service';
import { MediaTypes } from '@shared/types';
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

/**
 * Object placeholders
 */
export const ticketErrorPlaceholder = (): ObjectPlaceholderProps => ({
	description: TranslationService.getTranslation(
		'modules/media/const/index___ophalen-van-afspeel-token-mislukt'
	),
	reasonTitle: TranslationService.getTranslation(
		'modules/media/const/index___waarom-kan-ik-dit-object-niet-bekijken'
	),
	reasonDescription: TranslationService.getTranslation(
		'modules/media/const/index___er-ging-iets-mis-bij-het-ophalen-van-het-afspeel-token'
	),
	openModalButtonLabel: TranslationService.getTranslation(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___meer-info'
	),
	closeModalButtonLabel: TranslationService.getTranslation(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'
	),
});

export const objectPlaceholder = (): ObjectPlaceholderProps => ({
	...objectPlaceholderMock,
	openModalButtonLabel: TranslationService.getTranslation(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___meer-info'
	),
	closeModalButtonLabel: TranslationService.getTranslation(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'
	),
});

export const formatErrorPlaceholder = (format: string): ObjectPlaceholderProps => ({
	description: TranslationService.getTranslation(
		'modules/media/const/index___dit-formaat-wordt-niet-ondersteund-format',
		{
			format,
		}
	),
	reasonTitle: TranslationService.getTranslation(
		'modules/media/const/index___waarom-kan-ik-dit-object-niet-bekijken'
	),
	reasonDescription: TranslationService.getTranslation(
		'modules/media/const/index___het-formaat-van-de-data-wordt-op-dit-moment-niet-ondersteund'
	),
	openModalButtonLabel: TranslationService.getTranslation(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___meer-info'
	),
	closeModalButtonLabel: TranslationService.getTranslation(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'
	),
});

export const noLicensePlaceholder = (): ObjectPlaceholderProps => ({
	description: TranslationService.getTranslation(
		'modules/media/const/index___je-kan-dit-object-enkel-bekijken-tijdens-een-fysiek-bezoek-aan-de-bezoekersruimte'
	),
	reasonTitle: TranslationService.getTranslation(
		'modules/media/const/index___waarom-kan-ik-dit-object-niet-bekijken'
	),
	reasonDescription: TranslationService.getTranslation(
		'modules/media/const/index___dit-object-bevat-geen-licentie-voor-online-raadpleging-breng-een-bezoek-aan-de-bezoekersruimte'
	),
	openModalButtonLabel: TranslationService.getTranslation(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___meer-info'
	),
	closeModalButtonLabel: TranslationService.getTranslation(
		'pages/bezoekersruimte/visitor-space-slug/object-id/index___sluit'
	),
});

/**
 * Tabs
 */

const renderMediaTab = (mediaType?: MediaTypes) => {
	switch (mediaType) {
		case 'audio':
			return {
				id: ObjectDetailTabs.Media,
				label: TranslationService.getTranslation('modules/media/const/index___audio'),
				icon: <Icon name="audio" aria-hidden />,
			};
		case 'video':
			return {
				id: ObjectDetailTabs.Media,
				label: TranslationService.getTranslation('modules/media/const/index___video'),
				icon: <Icon name="video" aria-hidden />,
			};
		default:
			return {
				id: ObjectDetailTabs.Media,
				label: TranslationService.getTranslation('modules/media/const/index___video'),
				icon: <Icon name="no-video" aria-hidden />,
			};
	}
};

export const OBJECT_DETAIL_TABS = (mediaType?: MediaTypes): TabProps[] => [
	{
		id: ObjectDetailTabs.Metadata,
		label: TranslationService.getTranslation('modules/media/const/index___metadata'),
		icon: <Icon name="info" aria-hidden />,
	},
	renderMediaTab(mediaType),
];

/**
 * Actions
 */

export const MEDIA_ACTIONS = (
	canManageFolders: boolean,
	isInAFolder: boolean
): DynamicActionMenuProps => ({
	actions: [
		...((canManageFolders
			? [
					{
						label: TranslationService.getTranslation(
							'modules/media/const/index___bookmark'
						),
						icon: (
							<Icon
								className="u-font-size-24 u-text-left"
								name="bookmark"
								type={isInAFolder ? 'solid' : 'light'}
								aria-hidden
							/>
						),
						id: MediaActions.Bookmark,
						ariaLabel: TranslationService.getTranslation(
							'modules/media/const/index___bookmark'
						),
						tooltip: TranslationService.getTranslation(
							'modules/media/const/index___bookmark'
						),
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
export const METADATA_FIELDS = (mediaInfo: Media): MetadataItem[] =>
	[
		{
			title: TranslationService.getTranslation('modules/media/const/index___oorsprong'),
			data: mediaInfo.meemooOriginalCp,
		},
		{
			title: TranslationService.getTranslation(
				'modules/media/const/index___meemoo-identifier'
			),
			data: mediaInfo.meemooIdentifier,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___pid'),
			data: mediaInfo.premisIsPartOf,
		},
		{
			title: TranslationService.getTranslation(
				'modules/media/const/index___identifier-bij-aanbieder'
			),
			data: mediaInfo.meemooLocalId,
		},
		...mapObjectToMetadata(mediaInfo.premisIdentifier),
		{
			title: TranslationService.getTranslation('modules/media/const/index___serie'),
			data: mapArrayToMetadataData(mediaInfo.series),
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___programma'),
			data: mapArrayToMetadataData(mediaInfo.program),
		},
		{
			title: TranslationService.getTranslation(
				'modules/media/const/index___alternatieve-naam'
			),
			data: mediaInfo.alternateName,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___archief'),
			data: mapArrayToMetadataData(mediaInfo.partOfArchive),
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___serie'),
			data: mapArrayToMetadataData(mediaInfo.partOfSeries),
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___episode'),
			data: mapArrayToMetadataData(mediaInfo.partOfEpisode),
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___seizoen'),
			data: mapArrayToMetadataData(mediaInfo.partOfSeason),
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___bestandstype'),
			data: mediaInfo.dctermsFormat,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___analoge-drager'),
			data: mediaInfo.dctermsMedium,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___objecttype'),
			data: mediaInfo.ebucoreObjectType,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___duurtijd'),
			data: mediaInfo.duration,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___creatiedatum'),
			data: formatLongDate(asDate(mediaInfo.dateCreatedLowerBound)),
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___publicatiedatum'),
			data: formatLongDate(asDate(mediaInfo.datePublished)),
		},
		...mapObjectToMetadata(mediaInfo.creator),
		...mapObjectToMetadata(mediaInfo.contributor),
		...mapObjectToMetadata(mediaInfo.publisher),
		{
			title: TranslationService.getTranslation('modules/media/const/index___transcriptie'),
			data: mediaInfo?.representations?.[0]?.transcript, // TODO: Update voor andere representations?
		},
		{
			title: TranslationService.getTranslation(
				'modules/media/const/index___programmabeschrijving'
			),
			data: mediaInfo.meemooDescriptionProgramme,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___cast'),
			data: mediaInfo.meemooDescriptionCast,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___genre'),
			data: mapArrayToMetadataData(mediaInfo.genre),
		},
		...mapObjectToMetadata(mediaInfo.actor),
		{
			title: TranslationService.getTranslation(
				'modules/media/const/index___locatie-van-de-inhoud'
			),
			data: mapArrayToMetadataData(mediaInfo.spatial),
		},
		{
			title: TranslationService.getTranslation(
				'modules/media/const/index___tijdsperiode-van-de-inhoud'
			),
			data: mapArrayToMetadataData(mediaInfo.temporal),
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___taal'),
			data: mapArrayToMetadataData(mediaInfo.inLanguage),
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___filmbasis'),
			data: mediaInfo.meemoofilmBase,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___beeld-geluid'),
			data: mediaInfo.meemoofilmImageOrSound,
		},
		{
			title: TranslationService.getTranslation('modules/media/const/index___kleur-zwart-wit'),
			data: mapBooleanToMetadataData(mediaInfo.meemoofilmColor),
		},
		{
			title: TranslationService.getTranslation(
				'modules/media/const/index___uitgebreide-beschrijving'
			),
			data: mediaInfo?.abstract ? (
				<TextWithNewLines text={mediaInfo?.abstract} className="u-color-neutral" />
			) : null,
		},
		// {
		// 	title: TranslationService.getTranslation('modules/media/const/index___verwant'),
		// 	data: mediaInfo.premisRelationship,
		// },
		...mapObjectToMetadata(mediaInfo.premisRelationship),
	].filter((field) => !!field.data);
