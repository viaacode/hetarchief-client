import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { MediaTypes, ObjectDetailTabs } from '@media/types';
import { Icon } from '@shared/components';

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
