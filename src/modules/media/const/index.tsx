import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { ObjectDetailTabs } from '@media/types';
import { Icon } from '@shared/components';

export const OBJECT_DETAIL_TABS = (): TabProps[] => [
	{
		id: ObjectDetailTabs.Metadata,
		label: i18n?.t('Metadata'),
		icon: <Icon name="info" />,
	},
	{
		id: ObjectDetailTabs.Video,
		label: i18n?.t('Video'),
		icon: <Icon name="video" />,
	},
];
