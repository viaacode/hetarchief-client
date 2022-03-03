import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { MediaTypes, ObjectDetailTabs } from '@media/types';
import { Icon } from '@shared/components';

import { DynamicActionMenuProps } from '../components/DynamicActionMenu';

const renderMediaTab = (mediaType: MediaTypes) => {
	switch (mediaType) {
		case 'audio':
			return {
				id: ObjectDetailTabs.Media,
				label: i18n?.t('Audio'),
				icon: <Icon name="audio" />,
			};
		case 'video':
			return {
				id: ObjectDetailTabs.Media,
				label: i18n?.t('Video'),
				icon: <Icon name="video" />,
			};
		default:
			return {
				id: ObjectDetailTabs.Media,
				label: i18n?.t('Video'),
				icon: <Icon name="no-video" />,
			};
	}
};

export const OBJECT_DETAIL_TABS = (mediaType: MediaTypes): TabProps[] => [
	{
		id: ObjectDetailTabs.Metadata,
		label: i18n?.t('Metadata'),
		icon: <Icon name="info" />,
	},
	renderMediaTab(mediaType),
];

export const MEDIA_ACTIONS: DynamicActionMenuProps = {
	actions: [
		{
			label: 'quotes',
			iconName: 'quotes',
			id: 'quotes',
			ariaLabel: 'copies quotes',
		},
		{
			label: 'description',
			iconName: 'description',
			id: 'description',
			ariaLabel: 'shows description',
		},
		{
			label: 'bookmark',
			iconName: 'bookmark',
			id: 'bookmark',
			ariaLabel: 'bookmarks item',
		},
		{
			label: 'contact',
			iconName: 'contact',
			id: 'contact',
			ariaLabel: 'contact reading room',
		},
		{
			label: 'calendar',
			iconName: 'calendar',
			id: 'calendar',
			ariaLabel: 'copy date',
		},
		{
			label: 'related-objects',
			iconName: 'related-objects',
			id: 'related-objects',
			ariaLabel: 'access related objects',
		},
	],
	limit: 2,
	onClickAction: (id) => console.log(id),
};
