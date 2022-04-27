import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import { intersection } from 'lodash-es';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Permission } from '@account/const';
import { NavigationItem } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import { NavigationInfo } from '@navigation/services/navigation-service/navigation.types';
import { VisitorSpaceInfo } from '@reading-room/types';
import { Icon, IconName } from '@shared/components';
import { ROUTE_PREFIXES, ROUTES } from '@shared/const';
import { i18n } from '@shared/helpers/i18n';

const linkCls = (classNames: string[] = []) => {
	return clsx(styles['c-navigation__link'], ...classNames);
};

const dropdownCls = (classNames: string[] = []) => {
	return clsx('c-dropdown-menu__item', ...classNames);
};

const renderLink = (
	label: string,
	href: string,
	{
		badge,
		iconStart,
		iconEnd,
		className,
		tooltip,
		target,
		onClick,
	}: {
		badge?: ReactNode;
		iconStart?: ReactNode;
		iconEnd?: ReactNode;
		className?: string;
		tooltip?: string;
		target?: string;
		onClick?: () => void;
	} = {}
): ReactNode => {
	return href ? (
		<Link href={href}>
			<a
				className={className}
				role="menuitem"
				tabIndex={0}
				title={tooltip}
				target={target}
				onClick={onClick}
			>
				{iconStart && iconStart}
				{label}
				{badge && badge}
				{iconEnd && iconEnd}
			</a>
		</Link>
	) : (
		<a className={className} role="menuitem" tabIndex={0} title={tooltip} target={target}>
			{iconStart && iconStart}
			{label}
			{badge && badge}
			{iconEnd && iconEnd}
		</a>
	);
};

const getVisitorSpacesDropdown = (
	currentPath: string,
	accessibleReadingRooms: VisitorSpaceInfo[],
	linkedSpaceSlug: string | null
): NavigationItem => {
	if (linkedSpaceSlug) {
		// Single link to go to linked visitor space (kiosk visitor)
		return {
			node: renderLink(
				i18n.t('modules/navigation/components/navigation/navigation___bezoekersruimte'),
				'/' + linkedSpaceSlug,
				{
					badge: null,
					className: linkCls([
						'u-color-black',
						'u-color-white:md',
						'u-whitespace-nowrap',
					]),
				}
			),
			id: 'visitor-spaces',
			active: currentPath === '/' + linkedSpaceSlug,
		};
	} else {
		// Show dropdown list with homepage and accessible visitor spaces
		return {
			node: renderLink(
				i18n.t('modules/navigation/components/navigation/navigation___bezoekersruimtes'),
				'/',
				{
					badge:
						accessibleReadingRooms.length > 0 ? (
							<Badge text={accessibleReadingRooms.length} />
						) : null,
					className: linkCls([
						'u-color-black',
						'u-color-white:md',
						'u-whitespace-nowrap',
						styles['c-navigation__link--dropdown'],
					]),
				}
			),
			id: 'visitor-spaces',
			active: currentPath === ROUTES.home,
			children: [
				{
					node: renderLink(
						i18n.t(
							'modules/navigation/components/navigation/navigation___alle-bezoekersruimtes'
						),
						'/',
						{
							className: dropdownCls(['u-display-none', 'u-display-block:md']),
						}
					),
					id: 'all-visitor-spaces',
					isDivider: accessibleReadingRooms.length > 0 ? 'md' : undefined,
				},
				...accessibleReadingRooms.map(
					(visitorSpace: VisitorSpaceInfo): NavigationItem => ({
						node: ({ closeDropdowns }) =>
							renderLink(
								visitorSpace.name ||
									i18n.t(
										'modules/navigation/components/navigation/navigation___bezoekersruimte'
									),
								`/${visitorSpace.slug}`,
								{
									iconEnd: (
										<Icon
											className={clsx(
												'u-font-size-24',
												'u-text-left',
												'u-visibility-hidden',
												'u-visibility-visible:md',
												styles['c-navigation__dropdown-icon--end']
											)}
											name="angle-right"
										/>
									),
									className: dropdownCls(),
									onClick: () => {
										if (currentPath === `/${visitorSpace.slug}`) {
											closeDropdowns?.();
										}
									},
								}
							),
						id: visitorSpace.id,
					})
				),
			],
		};
	}
};

const getDynamicHeaderLinks = (currentPath: string, navigationItems: NavigationInfo[]) => {
	return navigationItems.map((navigationItem: NavigationInfo): NavigationItem => {
		return {
			active: currentPath === navigationItem.contentPath,
			id: navigationItem.id,
			node: renderLink(navigationItem.label, navigationItem.contentPath, {
				target: navigationItem.linkTarget || undefined,
				iconStart: navigationItem.iconName ? (
					<Icon name={navigationItem.iconName as IconName} />
				) : null,
				tooltip: navigationItem.tooltip || undefined,
				className: linkCls([
					'u-color-black',
					'u-color-white:md',
					'u-whitespace-nowrap',
					styles['c-navigation__link--dropdown'],
				]),
			}),
		};
	});
};

const getCpAdminManagementDropdown = (
	currentPath: string,
	permissions: Permission[]
): NavigationItem[] => {
	if (
		intersection(permissions, [
			Permission.APPROVE_DENY_CP_VISIT_REQUESTS,
			Permission.READ_CP_VISIT_REQUESTS,
			Permission.UPDATE_OWN_SPACE,
		]).length === 0
	) {
		// User does not have access to any of the cp admin screens
		return [];
	}
	return [
		{
			node: renderLink(
				i18n.t('modules/navigation/components/navigation/navigation___beheer'),
				'/beheer',
				{
					className: linkCls([
						'u-color-black',
						'u-color-white:md',
						styles['c-navigation__link--dropdown'],
					]),
				}
			),
			id: 'nav__beheer',
			active: currentPath.startsWith(`/${ROUTE_PREFIXES.beheer}`),
			children: [
				...(permissions.includes(Permission.APPROVE_DENY_CP_VISIT_REQUESTS)
					? [
							{
								node: renderLink(
									i18n.t(
										'modules/navigation/components/navigation/navigation___aanvragen'
									),
									'/beheer/aanvragen',
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--aanvragen',
							},
					  ]
					: []),
				...(permissions.includes(Permission.READ_CP_VISIT_REQUESTS)
					? [
							{
								node: renderLink(
									i18n.t(
										'modules/navigation/components/navigation/navigation___bezoekers'
									),
									'/beheer/bezoekers',
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--bezoekers',
							},
					  ]
					: []),
				...(permissions.includes(Permission.UPDATE_OWN_SPACE)
					? [
							{
								node: renderLink(
									i18n.t(
										'modules/navigation/components/navigation/navigation___instellingen'
									),
									'/beheer/instellingen',
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--instellingen',
							},
					  ]
					: []),
			],
		},
	];
};

const getMeemooAdminManagementDropdown = (
	currentPath: string,
	permissions: Permission[]
): NavigationItem[] => {
	if (
		intersection(permissions, [
			Permission.APPROVE_DENY_ALL_VISIT_REQUESTS,
			Permission.EDIT_ANY_CONTENT_PAGES,
			Permission.READ_ALL_SPACES,
			Permission.READ_ALL_VISIT_REQUESTS,
			Permission.UPDATE_ALL_SPACES,
		]).length === 0
	) {
		// User does not have access to any of the meemoo admin screens
		return [];
	}
	return [
		{
			node: renderLink(
				i18n.t('modules/navigation/components/navigation/navigation___admin'),
				'/admin/leeszalenbeheer/aanvragen',
				{
					className: linkCls([
						'u-color-black',
						'u-color-white:md',
						styles['c-navigation__link--dropdown'],
					]),
				}
			),
			id: 'nav__admin',
			active: currentPath.startsWith(`/${ROUTE_PREFIXES.admin}`),
		},
	];
};

export const getNavigationItemsLeft = (
	currentPath: string,
	accessibleReadingRooms: VisitorSpaceInfo[],
	navigationItems: NavigationInfo[],
	permissions: Permission[],
	linkedSpaceSlug: string | null
): NavigationItem[] => {
	const cpAdminLinks = getCpAdminManagementDropdown(currentPath, permissions);
	const meemooAdminLinks = getMeemooAdminManagementDropdown(currentPath, permissions);

	return [
		// Visitor space dropdown
		getVisitorSpacesDropdown(currentPath, accessibleReadingRooms, linkedSpaceSlug),

		// Some dynamic links from navigations table in database
		...getDynamicHeaderLinks(currentPath, navigationItems),

		// Divider separate from the other items, since items can be hidden because of permissions
		...((cpAdminLinks.length > 0 || meemooAdminLinks.length > 0
			? [
					{
						node: null,
						id: 'divider-before-admin-routes',
						isDivider: 'md',
					},
			  ]
			: []) as NavigationItem[]),

		// CP Admin dropdown link
		...cpAdminLinks,

		// Meemoo admin link
		...meemooAdminLinks,
	];
};
