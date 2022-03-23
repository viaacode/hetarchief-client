import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { MetadataItem, ObjectPlaceholderProps } from '@media/components';
import { objectPlaceholderMock } from '@media/components/ObjectPlaceholder/__mocks__/object-placeholder';
import { Media, MediaActions, ObjectDetailTabs } from '@media/types';
import { mapArrayToMetadataData, mapKeywordsToTagList, mapObjectToMetadata } from '@media/utils';
import { Icon } from '@shared/components';
import { MediaTypes } from '@shared/types';

import { DynamicActionMenuProps } from '../components/DynamicActionMenu';

/**
 * Render media
 */

export const FLOWPLAYER_FORMATS: string[] = ['mp4', 'mp3', 'm4a', 'ogv', 'ogg', 'webm', 'm3u8'];
export const IMAGE_FORMATS: string[] = ['png', 'jpg', 'jpeg', 'gif'];

/**
 * Object placeholders
 */
export const ticketErrorPlaceholder = (): ObjectPlaceholderProps => ({
	description: i18n?.t('modules/media/const/index___ophalen-van-afspeel-token-mislukt') || '',
	reasonTitle:
		i18n?.t('modules/media/const/index___waarom-kan-ik-dit-object-niet-bekijken') || '',
	reasonDescription:
		i18n?.t(
			'modules/media/const/index___er-ging-iets-mis-bij-het-ophalen-van-het-afspeel-token'
		) || '',
	openModalButtonLabel:
		i18n?.t('pages/leeszaal/reading-room-slug/object-id/index___meer-info') || '',
	closeModalButtonLabel:
		i18n?.t('pages/leeszaal/reading-room-slug/object-id/index___sluit') || '',
});

export const objectPlaceholder = (): ObjectPlaceholderProps => ({
	...objectPlaceholderMock,
	openModalButtonLabel:
		i18n?.t('pages/leeszaal/reading-room-slug/object-id/index___meer-info') || '',
	closeModalButtonLabel:
		i18n?.t('pages/leeszaal/reading-room-slug/object-id/index___sluit') || '',
});

export const formatErrorPlaceholder = (format: string): ObjectPlaceholderProps => ({
	description:
		i18n?.t('modules/media/const/index___dit-formaat-wordt-niet-ondersteund-format', {
			format,
		}) || '',
	reasonTitle:
		i18n?.t('modules/media/const/index___waarom-kan-ik-dit-object-niet-bekijken') || '',
	reasonDescription:
		i18n?.t(
			'modules/media/const/index___het-formaat-van-de-data-wordt-op-dit-moment-niet-ondersteund'
		) || '',
	openModalButtonLabel:
		i18n?.t('pages/leeszaal/reading-room-slug/object-id/index___meer-info') || '',
	closeModalButtonLabel:
		i18n?.t('pages/leeszaal/reading-room-slug/object-id/index___sluit') || '',
});

/**
 * Tabs
 */

const renderMediaTab = (mediaType: MediaTypes) => {
	switch (mediaType) {
		case 'audio':
			return {
				id: ObjectDetailTabs.Media,
				label: i18n?.t('modules/media/const/index___audio'),
				icon: <Icon name="audio" />,
			};
		case 'video':
			return {
				id: ObjectDetailTabs.Media,
				label: i18n?.t('modules/media/const/index___video'),
				icon: <Icon name="video" />,
			};
		default:
			return {
				id: ObjectDetailTabs.Media,
				label: i18n?.t('modules/media/const/index___video'),
				icon: <Icon name="no-video" />,
			};
	}
};

export const OBJECT_DETAIL_TABS = (mediaType: MediaTypes): TabProps[] => [
	{
		id: ObjectDetailTabs.Metadata,
		label: i18n?.t('modules/media/const/index___metadata'),
		icon: <Icon name="info" />,
	},
	renderMediaTab(mediaType),
];

/**
 * Actions
 */

export const MEDIA_ACTIONS = (): DynamicActionMenuProps => ({
	actions: [
		{
			label: i18n?.t('modules/media/const/index___quotes') ?? '',
			iconName: 'quotes',
			id: MediaActions.Quotes,
			ariaLabel: 'copies quotes',
			tooltip: i18n?.t('modules/media/const/index___quotes') ?? '',
		},
		{
			label: i18n?.t('modules/media/const/index___description') ?? '',
			iconName: 'description',
			id: MediaActions.Description,
			ariaLabel: 'shows description',
			tooltip: i18n?.t('modules/media/const/index___description') ?? '',
		},
		{
			label: i18n?.t('modules/media/const/index___bookmark') ?? '',
			iconName: 'bookmark',
			id: MediaActions.Bookmark,
			ariaLabel: 'bookmarks item',
			tooltip: i18n?.t('modules/media/const/index___bookmark') ?? '',
		},
		{
			label: i18n?.t('modules/media/const/index___contact') ?? '',
			iconName: 'contact',
			id: MediaActions.Contact,
			ariaLabel: 'contact reading room',
			tooltip: i18n?.t('modules/media/const/index___contact') ?? '',
		},
		{
			label: i18n?.t('modules/media/const/index___calendar') ?? '',
			iconName: 'calendar',
			id: MediaActions.Calendar,
			ariaLabel: 'copy date',
			tooltip: i18n?.t('modules/media/const/index___calendar') ?? '',
		},
		{
			label: i18n?.t('modules/media/const/index___related-objects') ?? '',
			iconName: 'related-objects',
			id: MediaActions.RelatedObjects,
			ariaLabel: 'access related objects',
			tooltip: i18n?.t('modules/media/const/index___related-objects') ?? '',
		},
	],
	limit: 2,
	onClickAction: (id) => console.log(id),
});

/**
 * Metadata
 */

// TODO: complete mapping
export const METADATA_FIELDS = (mediaInfo: Media): MetadataItem[] =>
	[
		// {
		// 	title: i18n?.t('modules/media/const/index___oorsprong') ?? '',
		// 	data: // Geen DB veld gelinkt
		// },
		{
			title: i18n?.t('modules/media/const/index___meemoo-identifier') ?? '',
			data: mediaInfo.id,
		},
		// TODO: Hoofd lokale CP (Identifier bij aanbieder)
		...mapObjectToMetadata(mediaInfo.premisIdentifier), // Overige ID's contentpartner
		{
			title: i18n?.t('modules/media/const/index___alternatief') ?? '',
			data: mediaInfo.alternateName,
		},
		{
			title: i18n?.t('modules/media/const/index___archief') ?? '',
			data: mapArrayToMetadataData(mediaInfo.partOfArchive),
		},
		{
			title: i18n?.t('modules/media/const/index___serie') ?? '',
			data: mapArrayToMetadataData(mediaInfo.partOfSeries),
		},
		{
			title: i18n?.t('modules/media/const/index___episode') ?? '',
			data: mapArrayToMetadataData(mediaInfo.partOfEpisode),
		},
		{
			title: i18n?.t('modules/media/const/index___seizoen') ?? '',
			data: mapArrayToMetadataData(mediaInfo.partOfSeason),
		},
		{
			title: i18n?.t('modules/media/const/index___bestandstype') ?? '',
			data: mediaInfo.dctermsFormat,
		},
		// {
		// 	title: i18n?.t('modules/media/const/index___analoge-drager') ?? '',
		// 	data: // Geen DB veld
		// },
		{
			title: i18n?.t('modules/media/const/index___objecttype') ?? '',
			data: mediaInfo.ebucoreObjectType,
		},
		{
			title: i18n?.t('modules/media/const/index___duurtijd') ?? '',
			data: mediaInfo.duration,
		},
		{
			title: i18n?.t('modules/media/const/index___creatiedatum') ?? '',
			data: mediaInfo.dateCreatedLowerBound,
		},
		{
			title: i18n?.t('modules/media/const/index___publicatiedatum') ?? '',
			data: mediaInfo.datePublished,
		},
		...mapObjectToMetadata(mediaInfo.creator),
		...mapObjectToMetadata(mediaInfo.contributor),
		...mapObjectToMetadata(mediaInfo.publisher),
		{
			title: i18n?.t('modules/media/const/index___uitgebreide-beschrijving') ?? '',
			data: mediaInfo.abstract,
		},
		{
			title: i18n?.t('modules/media/const/index___transcriptie') ?? '',
			data: mediaInfo.representations[0].transcript, // TODO: Update voor andere representations?
		},
		// {
		// 	title: i18n?.t('modules/media/const/index___ondertitels') ?? '',
		// 	data: // Niet in representations
		// },
		// {
		// 	title: i18n?.t('modules/media/const/index___programmabeschrijving') ?? '',
		// 	data: // Geen DB veld
		// },
		...mapObjectToMetadata(mediaInfo.actor),
		{
			title: i18n?.t('modules/media/const/index___genre') ?? '',
			data: mapArrayToMetadataData(mediaInfo.genre),
		},
		{
			title: i18n?.t('modules/media/const/index___locatie-van-de-inhoud') ?? '',
			data: mapArrayToMetadataData(mediaInfo.spatial),
		},
		{
			title: i18n?.t('modules/media/const/index___tijdsperiode-van-de-inhoud') ?? '',
			data: mapArrayToMetadataData(mediaInfo.temporal),
		},
		{
			title: i18n?.t('modules/media/const/index___trefwoorden') ?? '',
			data: mapKeywordsToTagList(mediaInfo.keywords),
		},
		{
			title: i18n?.t('modules/media/const/index___taal') ?? '',
			data: mapArrayToMetadataData(mediaInfo.inLanguage),
		},
		// Geen DB velden
		// {
		// 	title: i18n?.t('modules/media/const/index___type') ?? '',
		// 	data: mediaInfo.premisIdentifier,
		// },
		// {
		// 	title: i18n?.t('modules/media/const/index___filmbasis') ?? '',
		// 	data: mediaInfo.premisIdentifier,
		// },
		// {
		// 	title: i18n?.t('modules/media/const/index___beeld-geluid') ?? '',
		// 	data: mediaInfo.premisIdentifier,
		// },
		// {
		// 	title: i18n?.t('modules/media/const/index___kleur-zwart-wit') ?? '',
		// 	data: mediaInfo.premisIdentifier,
		// },
		// {
		// 	title: i18n?.t('modules/media/const/index___ondertitels') ?? '',
		// 	data: mediaInfo.premisIdentifier,
		// },
		// {
		// 	title: i18n?.t('modules/media/const/index___taal-ondertitels') ?? '',
		// 	data: mediaInfo.premisIdentifier,
		// },
		...mapObjectToMetadata(mediaInfo.isPartOf),
		// {
		// 	title: i18n?.t('modules/media/const/index___bevat') ?? '',
		// 	data: // Niet in type?
		// },
		{
			title: i18n?.t('modules/media/const/index___verwant') ?? '',
			data: mediaInfo.premisRelationship,
		},
	].filter((field) => !!field.data);
