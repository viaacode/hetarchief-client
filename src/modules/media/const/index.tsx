import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { MetadataItem } from '@media/components';
import { Media, MediaTypes, ObjectDetailTabs } from '@media/types';
import { mapDataToMetadata, mapKeywordsToTagList } from '@media/utils';
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
		if (field.data && (field.data as any[]).length) {
			metadata.push(field);
		}
		return metadata;
	}, []);
};

const METADATA_FIELDS = (mediaInfo: Media): MetadataItem[] => [
	// {
	// 	title: i18n?.t('Oorsprong') ?? '',
	// 	data: // Geen DB veld gelinkt
	// },
	{
		title: i18n?.t('PID') ?? '',
		data: mediaInfo.id,
	},
	{
		title: i18n?.t('External ID') ?? '',
		data: mediaInfo.meemooFragmentId,
	},
	// {
	// 	title: i18n?.t('Hoofd lokale CP ID') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('Overige lokale CP ID') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	{
		title: i18n?.t('CP naam') ?? '',
		data: mediaInfo.maintainerId, // TODO: get name
	},
	{
		title: i18n?.t('Secundaire titel') ?? '',
		data:
			mediaInfo.alternateName ??
			mediaInfo.partOfArchive ??
			mediaInfo.partOfEpisode ??
			mediaInfo.partOfSeason ??
			mediaInfo.partOfSeries,
	},
	{
		title: i18n?.t('Bestandstype') ?? '',
		data: mediaInfo.dctermsFormat,
	},
	{
		title: i18n?.t('Formaat') ?? '',
		data: mediaInfo.dctermsFormat,
	},
	{
		title: i18n?.t('Objecttype') ?? '',
		data: mediaInfo.ebucoreObjectType,
	},
	{
		title: i18n?.t('Duur') ?? '',
		data: mediaInfo.duration,
	},
	{
		title: i18n?.t('Datum creatie') ?? '',
		data: mediaInfo.dateCreatedLowerBound,
	},
	{
		title: i18n?.t('Datum uitzending/uitgave') ?? '',
		data: mediaInfo.datePublished,
	},
	...mapDataToMetadata(mediaInfo.creator),
	...mapDataToMetadata(mediaInfo.publisher),
	{
		title: i18n?.t('Uitgebreide beschrijving') ?? '',
		data: mediaInfo.abstract,
	},
	// {
	// 	title: i18n?.t('Programmabeschrijving') ?? '',
	// 	data: // Geen DB veld
	// },
	{
		title: i18n?.t('Cast') ?? '',
		data: mediaInfo.actor,
	},
	{
		title: i18n?.t('Genre') ?? '',
		data: mediaInfo.genre,
	},
	{
		title: i18n?.t('Coverage: ruimte') ?? '',
		data: mediaInfo.spatial,
	},
	{
		title: i18n?.t('Coverage: tijd') ?? '',
		data: mediaInfo.temporal,
	},
	{
		title: i18n?.t('Trefwoorden') ?? '',
		data: mapKeywordsToTagList(mediaInfo.keywords),
	},
	{
		title: i18n?.t('Taal') ?? '',
		data: mediaInfo.inLanguage,
	},
	// Geen DB velden
	// {
	// 	title: i18n?.t('Film: type') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('Film: base') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('Film: image/sound') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('Film: kleur') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('Film: ondertitels') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	// {
	// 	title: i18n?.t('Film: ondertitels (taal)') ?? '',
	// 	data: mediaInfo.premisIdentifier,
	// },
	{
		title: i18n?.t('Is deel van') ?? '',
		data: mediaInfo.isPartOf,
	},
	// {
	// 	title: i18n?.t('Bevat') ?? '',
	// 	data: // Niet in type?
	// },
	{
		title: i18n?.t('Verwant') ?? '',
		data: mediaInfo.premisRelationship,
	},
];
