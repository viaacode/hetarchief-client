import { Avatar, Button } from '@meemoo/react-components';
import clsx from 'clsx';

import { MaterialRequestCenterButton } from '@navigation/components/MaterialRequestCenter';
import { getNavigationItemsProfileDropdown } from '@navigation/components/Navigation/Navigation.consts';
import { NavigationLink } from '@navigation/components/Navigation/NavigationLink';
import {
	type NavigationHamburgerProps,
	type NavigationItem,
} from '@navigation/components/Navigation/NavigationSection/NavigationSection.types';
import {
	type NavigationInfo,
	type NavigationPlacement,
} from '@navigation/services/navigation-service';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight, IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { type Locale } from '@shared/utils/i18n';
import { type VisitorSpaceInfo } from '@visitor-space/types';

import styles from '../components/Navigation/Navigation.module.scss';
import { type NavItemsRightLoggedIn } from '../types';

export const GET_NAV_HAMBURGER_PROPS = (): NavigationHamburgerProps => ({
	openLabel: tText('modules/shared/const/navigation___sluit'),
	closedLabel: tText('modules/shared/const/navigation___menu'),
});

export const GET_NAV_ITEMS_RIGHT = (onLoginRegisterClick: () => void): NavigationItem[] => {
	return [
		{
			id: 'auth-button',
			path: '',
			node: (
				<Button
					className={styles['c-navigation__auth']}
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

export const GET_NAV_ITEMS_RIGHT_LOGGED_IN = (
	currentPath: string,
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	linkedSpaceSlug: string | null,
	locale: Locale,
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
					title={tText('modules/navigation/const/index___hover-notificaties')}
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
					linkedSpaceSlug,
					locale
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
