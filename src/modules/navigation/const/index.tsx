import { Avatar, Button } from '@meemoo/react-components';
import clsx from 'clsx';

import { MaterialRequestCenterButton } from '@navigation/components/MaterialRequestCenter';
import { getNavigationItemsProfileDropdown } from '@navigation/components/Navigation/Navigation.consts';
import { NavigationInfo, NavigationPlacement } from '@navigation/services/navigation-service';
import { Icon, IconNamesLight, IconNamesSolid } from '@shared/components';
import LanguageSwitcher from '@shared/components/LanguageSwitcher/LanguageSwitcher';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { VisitorSpaceInfo } from '@visitor-space/types';

import { NavigationHamburgerProps, NavigationItem, NavigationLink } from '../components';
import { NavItemsRightLoggedIn } from '../types';

export const NAV_HAMBURGER_PROPS = (): NavigationHamburgerProps => ({
	openLabel: tText('modules/shared/const/navigation___sluit'),
	closedLabel: tText('modules/shared/const/navigation___menu'),
});

const getLanguageSwitcher = () => {
	return {
		id: 'language-switcher',
		path: '',
		node: <LanguageSwitcher />,
	};
};

export const NAV_ITEMS_RIGHT = (onLoginRegisterClick: () => void): NavigationItem[] => {
	return [
		getLanguageSwitcher(),
		{
			id: 'auth-button',
			path: '',
			node: (
				<Button
					className="c-navigation__auth"
					key="nav-auth-button"
					label={tText(
						'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
					)}
					variants={['white', 'text']}
					onClick={onLoginRegisterClick}
				/>
			),
		},
	];
};

export const NAV_ITEMS_RIGHT_LOGGED_IN = (
	currentPath: string,
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	linkedSpaceSlug: string | null,
	{
		hasUnreadNotifications,
		notificationsOpen,
		userName,
		onLogOutClick,
		setNotificationsOpen,
	}: NavItemsRightLoggedIn
): NavigationItem[] => {
	const badgeCls = 'c-navigation__notifications-badge';

	return [
		getLanguageSwitcher(),
		{
			id: 'material-request-center',
			path: '',
			node: <MaterialRequestCenterButton />,
		},
		{
			id: 'notification-center',
			path: '',
			node: (
				<Button
					key="nav-notification-center"
					onClick={() => setNotificationsOpen(!notificationsOpen)}
					variants={['text', 'md']}
					className={clsx(
						notificationsOpen
							? `${badgeCls}--white u-color-teal`
							: `${badgeCls}--teal u-color-white`,
						{
							[badgeCls]: hasUnreadNotifications,
						}
					)}
					icon={<Icon name={IconNamesSolid.Notification} aria-hidden />}
					aria-label={tText('modules/navigation/const/index___notificaties')}
				/>
			),
		},
		{
			id: 'user-menu',
			path: '',
			node: (
				<Avatar variants="padded-y" text={userName}>
					<Icon name={IconNamesSolid.User} />
				</Avatar>
			),
			children: [
				...getNavigationItemsProfileDropdown(
					currentPath,
					navigationItems,
					accessibleVisitorSpaces,
					linkedSpaceSlug
				),
				{
					id: 'log-out',
					path: ROUTE_PARTS_BY_LOCALE[locale].logout,
					node: ({ closeDropdowns }) => (
						<NavigationLink
							iconStart={IconNamesLight.LogOut}
							label={tText('modules/navigation/const/index___log-uit')}
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
