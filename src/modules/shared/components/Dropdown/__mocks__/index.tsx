import React from 'react';

import { Icon } from '../../Icon/';

export const menuItemsWithIcons = [
	[
		{
			label: 'Notifications',
			id: 'notifications',
			icon: <Icon className="c-dropdown__icon" name="notification" />,
		},
		{
			label: 'Users',
			id: 'user',
			icon: <Icon className="c-dropdown__icon" name="user" />,
		},
		{
			label: 'Calendars',
			id: 'calendars',
			icon: <Icon className="c-dropdown__icon" name="calendar" />,
		},
		{
			label: 'News',
			id: 'news',
			icon: <Icon className="c-dropdown__icon" name="newspaper" />,
		},
	],
	[
		{
			label: 'Log out',
			id: 'logout',
			icon: <Icon className="c-dropdown__icon" name="log-out" />,
		},
	],
];
