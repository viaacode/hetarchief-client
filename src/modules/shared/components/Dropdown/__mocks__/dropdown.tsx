import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import React from 'react';

export const menuItemsWithIcons = [
	[
		{
			label: 'Notifications',
			id: 'notifications',
			iconStart: (
				<Icon className="c-dropdown__icon" name={IconNamesLight.Notification} aria-hidden />
			),
		},
		{
			label: 'Users',
			id: 'user',
			iconStart: <Icon className="c-dropdown__icon" name={IconNamesLight.User} aria-hidden />,
		},
		{
			label: 'Calendars',
			id: 'calendars',
			iconStart: <Icon className="c-dropdown__icon" name={IconNamesLight.Calendar} aria-hidden />,
		},
		{
			label: 'News',
			id: 'news',
			iconStart: <Icon className="c-dropdown__icon" name={IconNamesLight.Newspaper} aria-hidden />,
		},
	],
	[
		{
			label: 'Log out',
			id: 'logout',
			iconStart: <Icon className="c-dropdown__icon" name={IconNamesLight.LogOut} aria-hidden />,
		},
	],
];
