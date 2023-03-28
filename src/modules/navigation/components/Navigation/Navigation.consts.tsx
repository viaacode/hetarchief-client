import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import { groupBy, intersection, isNil } from 'lodash-es';
import Link from 'next/link';
import { stringifyUrl } from 'query-string';
import { MouseEventHandler, ReactNode } from 'react';

import { Permission } from '@account/const';
import { NAVIGATION_DROPDOOWN, NavigationItem, NavigationLink } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import {
	NavigationInfo,
	NavigationPlacement,
} from '@navigation/services/navigation-service/navigation.types';
import { Icon, IconName, IconNamesLight } from '@shared/components';
import { ROUTE_PARTS, ROUTE_PREFIXES, ROUTES } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { Breakpoints } from '@shared/types';
import { VisitorSpaceFilterId, VisitorSpaceInfo } from '@visitor-space/types';

const linkCls = (...classNames: string[]) => {
	return clsx(styles['c-navigation__link'], ...classNames);
};

const dropdownCls = (...classNames: string[]) => {
	return clsx('c-dropdown-menu__item', ...classNames);
};

const linkClasses = linkCls(
	'u-color-black',
	'u-color-white:xxl',
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
	linkedSpaceOrId: string | null
): NavigationItem => {
	if (linkedSpaceOrId) {
		// Single link to go to linked visitor space (kiosk visitor)
		const searchRouteForSpace = `/${ROUTE_PARTS.search}?${VisitorSpaceFilterId.Maintainer}=${linkedSpaceOrId}`;
		return {
			node: renderLink(
				tText('modules/navigation/components/navigation/navigation___bezoekersruimte'),
				searchRouteForSpace,
				{
					badge: null,
					className: linkClasses,
				}
			),
			id: 'visitor-spaces',
			path: currentPath,
			activeDesktop: currentPath.startsWith(searchRouteForSpace),
			activeMobile: currentPath.startsWith(searchRouteForSpace),
		};
	} else if (accessibleVisitorSpaces.length === 0) {
		// No visitor spaces available => show link to bezoek page without dropdown
		return {
			node: renderLink(navigationLabel, ROUTES.bezoek, {
				className: linkClasses,
			}),
			id: 'visitor-spaces',
			activeDesktop: currentPath === ROUTES.bezoek,
			activeMobile: currentPath === ROUTES.bezoek,
			path: currentPath,
		};
	} else {
		// Show dropdown list with bezoek page and accessible visitor spaces
		return {
			node: renderLink(navigationLabel, ROUTES.bezoek, {
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
			path: currentPath,
			activeDesktop: currentPath === ROUTES.bezoek,
			activeMobile: currentPath === ROUTES.bezoek,
			children: [
				{
					node: renderLink(
						tText(
							'modules/navigation/components/navigation/navigation___alle-bezoekersruimtes'
						),
						ROUTES.bezoek,
						{
							className: dropdownCls('u-display-none', 'u-display-block:xxl'),
						}
					),
					id: 'all-visitor-spaces',
					path: currentPath,
					isDivider: accessibleVisitorSpaces.length > 0 ? 'md' : undefined,
				},
				...accessibleVisitorSpaces.map((visitorSpace: VisitorSpaceInfo): NavigationItem => {
					const searchRouteForSpace = `/${ROUTE_PARTS.search}?${VisitorSpaceFilterId.Maintainer}=${visitorSpace.slug}`;
					return {
						node: ({ closeDropdowns }) =>
							renderLink(
								visitorSpace.name ||
									tText(
										'modules/navigation/components/navigation/navigation___bezoekersruimte'
									),
								searchRouteForSpace,
								{
									iconEnd: (
										<Icon
											className={clsx(
												'u-font-size-24',
												'u-text-left',
												'u-visibility-hidden',
												'u-visibility-visible:xxl',
												styles['c-navigation__dropdown-icon--end']
											)}
											name={IconNamesLight.AngleRight}
										/>
									),
									className: dropdownCls(),
									onClick: () => {
										if (currentPath === searchRouteForSpace) {
											closeDropdowns?.();
										}
									},
								}
							),
						id: visitorSpace.id,
						activeDesktop: currentPath.startsWith(searchRouteForSpace),
						activeMobile: currentPath.startsWith(searchRouteForSpace),
						path: currentPath,
					};
				}),
			],
		};
	}
};

const getDynamicHeaderLinks = (
	currentPath: string,
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	placement: NavigationPlacement,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	linkedSpaceOrId: string | null
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
					linkedSpaceOrId
				);
			}

			return {
				activeDesktop: currentPath.includes(contentPath),
				activeMobile: currentPath.includes(contentPath),
				id,
				path: contentPath,
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
	maintainerId: string | null,
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
				isMobile ? ROUTES.beheerRequests : '',
				{
					className: linkClasses,
				}
			),
			id: 'nav__beheer',
			activeDesktop: currentPath.startsWith(`/${ROUTE_PREFIXES.beheer}`),
			path: currentPath,
			children: [
				...(permissions.includes(Permission.APPROVE_DENY_CP_VISIT_REQUESTS)
					? [
							{
								node: renderLink(
									tText(
										'modules/navigation/components/navigation/navigation___aanvragen'
									),
									ROUTES.beheerRequests,
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--aanvragen',
								path: currentPath,
								activeMobile: currentPath.startsWith(ROUTES.beheerRequests),
							},
					  ]
					: []),
				...(permissions.includes(Permission.VIEW_ANY_MATERIAL_REQUESTS)
					? [
							{
								node: renderLink(
									tText(
										'modules/navigation/components/navigation/navigation___materiaalaanvragen'
									),
									ROUTES.beheerMaterialRequests,
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--materiaalaanvragen',
								path: currentPath,
								activeMobile: currentPath.startsWith(ROUTES.beheerMaterialRequests),
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
									ROUTES.beheerVisitors,
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--bezoekers',
								path: currentPath,
								activeMobile: currentPath.startsWith(ROUTES.beheerVisitors),
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
									ROUTES.beheerSettings,
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--instellingen',
								path: currentPath,
								activeMobile: currentPath.startsWith(ROUTES.beheerSettings),
							},
					  ]
					: []),

				...(!isNil(maintainerId)
					? [
							{
								node: renderLink(
									tText(
										'modules/navigation/components/navigation/navigation___naar-mijn-bezoekerstool'
									),
									stringifyUrl({
										url: `/${ROUTE_PARTS.search}`,
										query: {
											[VisitorSpaceFilterId.Maintainer]: maintainerId,
										},
									}),
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--mijn-bezoekerstool',
								path: currentPath,
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
			path: currentPath,
		},
	];
};

const getDivider = (id: string): NavigationItem =>
	({
		id,
		node: null,
		isDivider: 'md',
	} as NavigationItem);

export const getNavigationItemsLeft = (
	currentPath: string,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	permissions: Permission[],
	linkedSpaceOrId: string | null,
	isMobile: boolean,
	maintainerId: string | null
): NavigationItem[] => {
	const beforeDivider = getDynamicHeaderLinks(
		currentPath,
		navigationItems,
		NavigationPlacement.HeaderLeft,
		accessibleVisitorSpaces,
		linkedSpaceOrId
	);
	const afterDivider = getDynamicHeaderLinks(
		currentPath,
		navigationItems,
		NavigationPlacement.HeaderRight,
		accessibleVisitorSpaces,
		linkedSpaceOrId
	);

	const cpAdminLinks = getCpAdminManagementDropdown(
		currentPath,
		permissions,
		maintainerId,
		isMobile
	);
	const meemooAdminLinks = getMeemooAdminManagementDropdown(currentPath, permissions);

	return [
		// Some dynamic links from navigations table in database
		...beforeDivider,

		// Divider separate from the other items
		...(afterDivider.length > 0 ? [getDivider('divider-before-visitor-spaces')] : []),

		// Some dynamic links from navigations table in database
		...afterDivider,

		// Some hard coded links we always need to show on mobile
		...(isMobile ? [...cpAdminLinks, ...meemooAdminLinks] : []),
	];
};

export const getNavigationItemsProfileDropdown = (
	currentPath: string,
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	linkedSpaceOrId: string | null
): NavigationItem[] => {
	const profileDropdown = getDynamicHeaderLinks(
		currentPath,
		navigationItems,
		NavigationPlacement.ProfileDropdown,
		accessibleVisitorSpaces,
		linkedSpaceOrId
	);

	// Group navigation items by type
	const { defaultRoutes, adminRoutes, cpRoutes } = groupBy(
		profileDropdown,
		(navItem: NavigationItem) => {
			if (navItem.path?.startsWith('/admin')) {
				return 'adminRoutes';
			}

			if (navItem.path?.startsWith('/beheer')) {
				return 'cpRoutes';
			}

			return 'defaultRoutes';
		}
	);

	return [
		...(defaultRoutes || []),
		...((adminRoutes || [])?.length > 0
			? [getDivider('divider-before-admin-routes'), ...adminRoutes]
			: []),
		...((cpRoutes || [])?.length > 0
			? [getDivider('divider-before-cp-routes'), ...cpRoutes]
			: []),
		getDivider('divider-before-logout'),
	];
};
