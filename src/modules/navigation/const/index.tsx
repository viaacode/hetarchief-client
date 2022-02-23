import { Avatar, Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { i18n } from 'next-i18next';

import { ACCOUNT_NAVIGATION_LINKS } from '@account/const';
import { Icon } from '@shared/components';

import { NavigationHamburgerProps, NavigationItem, NavigationLink } from '../components';
import { NavItemsRightLoggedIn } from '../types';

export const NAV_HAMBURGER_PROPS = (): NavigationHamburgerProps => ({
	openLabel: i18n?.t('modules/shared/const/navigation___sluit') ?? '',
	closedLabel: i18n?.t('modules/shared/const/navigation___menu') ?? '',
});

export const NAV_ITEMS_RIGHT = (onLoginRegisterClick: () => void): NavigationItem[] => {
	return [
		{
			id: 'auth-button',
			node: (
				<Button
					key="nav-auth-button"
					label={i18n?.t(
						'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
					)}
					variants={['white', 'text']}
					onClick={onLoginRegisterClick}
				/>
			),
		},
	];
};

export const NAV_ITEMS_RIGHT_LOGGED_IN = ({
	anyUnreadNotifications,
	notificationsOpen,
	userName,
	onLogOutClick,
	setNotificationsOpen,
}: NavItemsRightLoggedIn): NavigationItem[] => {
	const badgeCls = 'c-navigation__notifications-badge';

	return [
		{
			id: 'notification-center',
			node: (
				<Button
					key="nav-notification-center"
					onClick={() => setNotificationsOpen(!notificationsOpen)}
					variants="text"
					className={clsx(
						notificationsOpen
							? `${badgeCls}--white u-color-teal`
							: `${badgeCls}--teal u-color-white`,
						{
							[badgeCls]: anyUnreadNotifications,
						}
					)}
					icon={<Icon type="solid" name="notification" />}
				/>
			),
		},
		{
			id: 'user-menu',
			node: (
				<Avatar variants="padded-y" text={userName}>
					<Icon type="solid" name="user" />
				</Avatar>
			),
			children: [
				...ACCOUNT_NAVIGATION_LINKS().map(({ label, href, ...rest }) => ({
					...rest,
					node: <NavigationLink href={href} label={label} isDropdownItem />,
				})),
				{
					id: 'log-out',
					node: ({ closeDropdowns }) => (
						<NavigationLink
							iconStart="log-out"
							label={i18n?.t('modules/navigation/const/index___log-uit')}
							onClick={() => {
								onLogOutClick();
								closeDropdowns();
							}}
							isDropdownItem
						/>
					),
				},
			],
		},
	];
};
