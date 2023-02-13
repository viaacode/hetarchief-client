import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import { groupBy, intersection } from 'lodash-es';
import Link from 'next/link';
import { MouseEventHandler, ReactNode } from 'react';

import { Permission } from '@account/const';
import { NavigationItem, NavigationLink } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import {
	NavigationInfo,
	NavigationPlacement,
} from '@navigation/services/navigation-service/navigation.types';
import { Icon, IconName, IconNamesLight } from '@shared/components';
import { ROUTE_PARTS, ROUTE_PREFIXES, ROUTES } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { Breakpoints } from '@shared/types';
import { VisitorSpaceInfo } from '@visitor-space/types';

export enum NAVIGATION_DROPDOOWN {
	VISITOR_SPACES = '<BOEZOEKERRUIMTES_DROPDOWN>',
}

const linkCls = (...classNames: string[]) => {
	return clsx(styles['c-navigation__link'], ...classNames);
};

const dropdownCls = (...classNames: string[]) => {
	return clsx('c-dropdown-menu__item', ...classNames);
};

const linkClasses = linkCls(
	'u-color-black',
	'u-color-white:md',
	'u-whitespace-nowrap',
	styles['c-navigation__link--dropdown']
);

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
		onClick?: MouseEventHandler<HTMLAnchorElement>;
	} = {},
	placement: NavigationPlacement | undefined = undefined
): ReactNode => {
	const isDropdown = placement === NavigationPlacement.ProfileDropdown;
	const cn = clsx(className, {
		[styles['c-navigation__link--icon']]: iconStart || iconEnd,
		[styles['c-navigation__link--icon-start']]: iconStart,
		[styles['c-navigation__link--icon-end']]: iconEnd,
	});

	if (href) {
		return isDropdown ? (
			<NavigationLink href={href} label={label} isDropdownItem />
		) : (
			<Link href={href}>
				<a
					aria-label={tooltip}
					className={cn}
					onClick={onClick}
					tabIndex={0}
					target={target}
					title={tooltip}
				>
					{iconStart && iconStart}
					{label}
					{badge && badge}
					{iconEnd && iconEnd}
				</a>
			</Link>
		);
	}

	return (
		<a aria-label={tooltip} className={cn} tabIndex={0} target={target} title={tooltip}>
			{iconStart && iconStart}
			{label}
			{badge && badge}
			{iconEnd && iconEnd}
		</a>
	);
};

const getVisitorSpacesDropdown = (
	navigationLabel: string,
	currentPath: string,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	linkedSpaceSlug: string | null
): NavigationItem => {
	if (linkedSpaceSlug) {
		// Single link to go to linked visitor space (kiosk visitor)
		return {
			node: renderLink(
				tText('modules/navigation/components/navigation/navigation___bezoekersruimte'),
				'/' + linkedSpaceSlug,
				{
					badge: null,
					className: linkClasses,
				}
			),
			id: 'visitor-spaces',
			activeDesktop: currentPath.startsWith('/' + linkedSpaceSlug),
			activeMobile: currentPath.startsWith('/' + linkedSpaceSlug),
		};
	} else if (accessibleVisitorSpaces.length === 0) {
		// No visitor spaces available => show link to homepage without dropdown
		return {
			node: renderLink(navigationLabel, '/', {
				className: linkClasses,
			}),
			id: 'visitor-spaces',
			activeDesktop: currentPath === ROUTES.home,
			activeMobile: currentPath === ROUTES.home,
		};
	} else {
		// Show dropdown list with homepage and accessible visitor spaces
		return {
			node: renderLink(navigationLabel, '/', {
				badge: <Badge text={accessibleVisitorSpaces.length} />,
				className: linkClasses,
				// Make link clickable in hamburger menu
				onClick: (e) => {
					if (window.innerWidth > Breakpoints.md) {
						e.preventDefault();
					}
				},
			}),
			id: 'visitor-spaces',
			activeDesktop:
				currentPath === ROUTES.home ||
				!!accessibleVisitorSpaces.find((visitorSpace) =>
					currentPath.startsWith(`/${visitorSpace.slug}`)
				),
			activeMobile: currentPath === ROUTES.home,
			children: [
				{
					node: renderLink(
						tText(
							'modules/navigation/components/navigation/navigation___alle-bezoekersruimtes'
						),
						'/',
						{
							className: dropdownCls('u-display-none', 'u-display-block:md'),
						}
					),
					id: 'all-visitor-spaces',
					isDivider: accessibleVisitorSpaces.length > 0 ? 'md' : undefined,
				},
				...accessibleVisitorSpaces.map(
					(visitorSpace: VisitorSpaceInfo): NavigationItem => ({
						node: ({ closeDropdowns }) =>
							renderLink(
								visitorSpace.name ||
									tText(
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
											name={IconNamesLight.AngleRight}
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
						activeMobile: currentPath.startsWith(`/${visitorSpace.slug}`),
					})
				),
			],
		};
	}
};

const getDynamicHeaderLinks = (
	currentPath: string,
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	placement: NavigationPlacement,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	linkedSpaceSlug: string | null
) => {
	const itemsByPlacement = navigationItems[placement];

	if (!itemsByPlacement || !itemsByPlacement.length) {
		return [];
	}

	return itemsByPlacement.map(
		({
			contentPath,
			id,
			label,
			linkTarget,
			iconName,
			tooltip,
		}: NavigationInfo): NavigationItem => {
			if (contentPath === NAVIGATION_DROPDOOWN.VISITOR_SPACES) {
				return getVisitorSpacesDropdown(
					label,
					currentPath,
					accessibleVisitorSpaces,
					linkedSpaceSlug
				);
			}

			return {
				activeDesktop: currentPath === contentPath,
				activeMobile: currentPath === contentPath,
				id: id,
				node: renderLink(
					label,
					contentPath,
					{
						target: linkTarget || undefined,
						iconStart: iconName ? <Icon name={iconName as IconName} /> : null,
						tooltip: tooltip || undefined,
						className: linkClasses,
					},
					placement
				),
			};
		}
	);
};

const getCpAdminManagementDropdown = (
	currentPath: string,
	permissions: Permission[],
	isMobile: boolean
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
				tText('modules/navigation/components/navigation/navigation___beheer'),
				isMobile ? `/${ROUTE_PREFIXES.beheer}/${ROUTE_PARTS.visitRequests}` : '',
				{
					className: linkClasses,
				}
			),
			id: 'nav__beheer',
			activeDesktop: currentPath.startsWith(`/${ROUTE_PREFIXES.beheer}`),
			children: [
				...(permissions.includes(Permission.APPROVE_DENY_CP_VISIT_REQUESTS)
					? [
							{
								node: renderLink(
									tText(
										'modules/navigation/components/navigation/navigation___aanvragen'
									),
									'/beheer/aanvragen',
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--aanvragen',
								activeMobile: currentPath.startsWith('/beheer/aanvragen'),
							},
					  ]
					: []),
				...(permissions.includes(Permission.READ_CP_VISIT_REQUESTS)
					? [
							{
								node: renderLink(
									tText(
										'modules/navigation/components/navigation/navigation___bezoekers'
									),
									'/beheer/bezoekers',
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--bezoekers',
								activeMobile: currentPath.startsWith('/beheer/bezoekers'),
							},
					  ]
					: []),
				...(permissions.includes(Permission.UPDATE_OWN_SPACE)
					? [
							{
								node: renderLink(
									tText(
										'modules/navigation/components/navigation/navigation___instellingen'
									),
									'/beheer/instellingen',
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--instellingen',
								activeMobile: currentPath.startsWith('/beheer/instellingen'),
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
				tText('modules/navigation/components/navigation/navigation___admin'),
				`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitorSpaces}`,
				{
					className: linkClasses,
				}
			),
			id: 'nav__admin',
			activeDesktop: currentPath.startsWith(`/${ROUTE_PREFIXES.admin}`),
			activeMobile: currentPath.startsWith(`/${ROUTE_PREFIXES.admin}`),
		},
	];
};

export const getNavigationItemsLeft = (
	currentPath: string,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	permissions: Permission[],
	linkedSpaceSlug: string | null,
	isMobile: boolean
): NavigationItem[] => {
	const beforeDivider = getDynamicHeaderLinks(
		currentPath,
		navigationItems,
		NavigationPlacement.HeaderLeft,
		accessibleVisitorSpaces,
		linkedSpaceSlug
	);
	const afterDivider = getDynamicHeaderLinks(
		currentPath,
		navigationItems,
		NavigationPlacement.HeaderRight,
		accessibleVisitorSpaces,
		linkedSpaceSlug
	);

	return [
		// Some dynamic links from navigations table in database
		...beforeDivider,

		// Divider separate from the other items
		...((afterDivider.length > 0
			? [
					{
						node: null,
						id: 'divider-before-admin-routes',
						isDivider: 'md',
					},
			  ]
			: []) as NavigationItem[]),

		// Some dynamic links from navigations table in database
		...afterDivider,
	];
};

export const getNavigationItemsProfileDropdown = (
	currentPath: string,
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	linkedSpaceSlug: string | null
): NavigationItem[] => {
	const profileDropdown = getDynamicHeaderLinks(
		currentPath,
		navigationItems,
		NavigationPlacement.ProfileDropdown,
		accessibleVisitorSpaces,
		linkedSpaceSlug
	);

	const divider = [
		{
			node: null,
			id: 'divider-before-admin-routes',
			isDivider: 'md',
		},
	] as NavigationItem[];

	// Group navigation items by type
	const { defaultRoutes, adminRoutes, cpRoutes } = groupBy(
		profileDropdown,
		(navItem: NavigationItem) => {
			const route = navItem?.node?.props?.href;

			if (route.startsWith('/admin')) {
				return 'adminRoutes';
			}

			if (route.startsWith('/beheer')) {
				return 'cpRoutes';
			}

			return 'defaultRoutes';
		}
	);

	return [
		...(defaultRoutes || []),
		...((adminRoutes || [])?.length > 0 ? [...divider, ...adminRoutes] : []),
		...((cpRoutes || [])?.length > 0 ? [...divider, ...cpRoutes] : []),
		...divider,
	];
};
