import React from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

export const menuItemsWithIcons = [
	[
		{
			label: 'Notifications',
			id: 'notifications',
			iconStart: <Icon className="c-dropdown__icon" name={IconNamesLight.Notification} />,
		},
		{
			label: 'Users',
			id: 'user',
			iconStart: <Icon className="c-dropdown__icon" name={IconNamesLight.User} />,
		},
		{
			label: 'Calendars',
			id: 'calendars',
			iconStart: <Icon className="c-dropdown__icon" name={IconNamesLight.Calendar} />,
		},
		{
			label: 'News',
			id: 'news',
			iconStart: <Icon className="c-dropdown__icon" name={IconNamesLight.Newspaper} />,
		},
	],
	[
		{
			label: 'Log out',
			id: 'logout',
			iconStart: <Icon className="c-dropdown__icon" name={IconNamesLight.LogOut} />,
		},
	],
];
