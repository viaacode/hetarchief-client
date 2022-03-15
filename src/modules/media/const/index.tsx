import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { ObjectDetailTabs } from '@media/types';
import { Icon } from '@shared/components';
import { MediaTypes } from '@shared/types';

import { DynamicActionMenuProps } from '../components/DynamicActionMenu';

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
