import { Avatar, Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { i18n } from 'next-i18next';

import { Icon, NavigationHamburgerProps, NavigationItem, NavigationLink } from '@shared/components';
import { NavItemsRightLoggedIn } from '@shared/types/navigation';

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
				{
					id: 'profile',
					node: (
						<NavigationLink href="/" label={i18n?.t('Mijn profiel')} isDropdownItem />
					),
				},
				{
					id: 'folders',
					node: <NavigationLink href="/" label={i18n?.t('Mijn mappen')} isDropdownItem />,
				},
				{
					id: 'history',
					node: (
						<NavigationLink href="/" label={i18n?.t('Mijn historiek')} isDropdownItem />
					),
					hasDivider: true,
				},
				{
					id: 'log-out',
					node: (
						<NavigationLink
							iconStart={<Icon name="log-out" />}
							label={i18n?.t('Log uit')}
							onClick={onLogOutClick}
							isDropdownItem
						/>
					),
				},
			],
		},
	];
};
