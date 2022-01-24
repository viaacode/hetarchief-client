import React from 'react';

import { Icon } from '../../Icon';

export const menuItemsWithIcons = [
	[
		{
			label: 'Notifications',
			id: 'notifications',
			iconStart: <Icon className="c-dropdown__icon" name="notification" />,
		},
		{
			label: 'Users',
			id: 'user',
			iconStart: <Icon className="c-dropdown__icon" name="user" />,
		},
		{
			label: 'Calendars',
			id: 'calendars',
			iconStart: <Icon className="c-dropdown__icon" name="calendar" />,
		},
		{
			label: 'News',
			id: 'news',
			iconStart: <Icon className="c-dropdown__icon" name="newspaper" />,
		},
	],
	[
		{
			label: 'Log out',
			id: 'logout',
			iconStart: <Icon className="c-dropdown__icon" name="log-out" />,
		},
	],
];
