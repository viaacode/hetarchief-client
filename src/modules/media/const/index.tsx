import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { MetadataItem } from '@media/components';
import { Media, MediaTypes, ObjectDetailTabs } from '@media/types';
import { mapKeywordsToTagList, mapObjectToMetadata } from '@media/utils';
import { Icon } from '@shared/components';

import { DynamicActionMenuProps } from '../components/DynamicActionMenu';

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
			label: 'Quotes',
			iconName: 'quotes',
			id: 'quotes',
			ariaLabel: 'copies quotes',
			tooltip: i18n?.t('modules/media/const/index___quotes') ?? '',
		},
		{
			label: 'Description',
			iconName: 'description',
			id: 'description',
			ariaLabel: 'shows description',
			tooltip: i18n?.t('modules/media/const/index___description') ?? '',
		},
		{
			label: 'Bookmark',
			iconName: 'bookmark',
			id: 'bookmark',
			ariaLabel: 'bookmarks item',
			tooltip: i18n?.t('modules/media/const/index___bookmark') ?? '',
		},
		{
			label: 'Contact',
			iconName: 'contact',
			id: 'contact',
			ariaLabel: 'contact reading room',
			tooltip: i18n?.t('modules/media/const/index___contact') ?? '',
		},
		{
			label: 'Calendar',
			iconName: 'calendar',
			id: 'calendar',
			ariaLabel: 'copy date',
			tooltip: i18n?.t('modules/media/const/index___calendar') ?? '',
		},
		{
			label: 'Related-objects',
			iconName: 'related-objects',
			id: 'related-objects',
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

export const PARSED_METADATA_FIELDS = (mediaInfo: Media): MetadataItem[] => {
	// Hide empty metadata fields
	return METADATA_FIELDS(mediaInfo).reduce((metadata: MetadataItem[], field) => {
		if (field.data) {
			metadata.push(field);
		}
		return metadata;
	}, []);
};

const METADATA_FIELDS = (mediaInfo: Media): MetadataItem[] => [
	// {
	// 	title: i18n?.t('modules/media/const/index___oorsprong') ?? '',
	// 	data: // Geen DB veld gelinkt
	// },
	{
		title: i18n?.t('modules/media/const/index___meemoo-identifier') ?? '',
		data: mediaInfo.id,
	},
	{
		title: i18n?.t('modules/media/const/index___external-id') ?? '',
		data: mediaInfo.meemooFragmentId,
	},
	...mapObjectToMetadata(mediaInfo.premisIdentifier),
	// {
	// 	title: i18n?.t('modules/media/const/index___cp-naam') ?? '',
	// 	data: mediaInfo.maintainerId, // TODO: get name
	// },
	{
		title: i18n?.t('Alternatief') ?? '',
		data: mediaInfo.alternateName,
	},
	{
		title: i18n?.t('Archief') ?? '',
		data: mediaInfo.partOfArchive,
	},
	{
		title: i18n?.t('Serie') ?? '',
		data: mediaInfo.partOfSeries,
	},
	{
		title: i18n?.t('Episode') ?? '',
		data: mediaInfo.partOfEpisode,
	},
	{
		title: i18n?.t('Seizoen') ?? '',
		data: mediaInfo.partOfSeason,
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
	...mapObjectToMetadata(mediaInfo.publisher),
	{
		title: i18n?.t('modules/media/const/index___uitgebreide-beschrijving') ?? '',
		data: mediaInfo.abstract,
	},
	// {
	// 	title: i18n?.t('modules/media/const/index___programmabeschrijving') ?? '',
	// 	data: // Geen DB veld
	// },
	{
		title: i18n?.t('modules/media/const/index___cast') ?? '',
		data: mediaInfo.actor,
	},
	{
		title: i18n?.t('modules/media/const/index___genre') ?? '',
		data: mediaInfo.genre.length ? mediaInfo.genre : null,
	},
	{
		title: i18n?.t('modules/media/const/index___locatie-van-de-inhoud') ?? '',
		data: mediaInfo.spatial,
	},
	{
		title: i18n?.t('modules/media/const/index___tijdsperiode-van-de-inhoud') ?? '',
		data: mediaInfo.temporal,
	},
	{
		title: i18n?.t('modules/media/const/index___trefwoorden') ?? '',
		data: mapKeywordsToTagList(mediaInfo.keywords),
	},
	{
		title: i18n?.t('modules/media/const/index___taal') ?? '',
		data: mediaInfo.inLanguage,
	},
	// Geen DB velden
	// {
	// 	title: i18n?.t('modules/media/const/index___film-type') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('modules/media/const/index___film-base') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('modules/media/const/index___film-image-sound') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('modules/media/const/index___film-kleur') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('modules/media/const/index___film-ondertitels') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('modules/media/const/index___film-ondertitels-taal') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	{
		title: i18n?.t('modules/media/const/index___is-deel-van') ?? '',
		data: mediaInfo.isPartOf,
	},
	// {
	// 	title: i18n?.t('modules/media/const/index___bevat') ?? '',
	// 	data: // Niet in type?
	// },
	{
		title: i18n?.t('modules/media/const/index___verwant') ?? '',
		data: mediaInfo.premisRelationship,
	},
];
