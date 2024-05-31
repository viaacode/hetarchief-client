import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import { groupBy, intersection, isNil } from 'lodash-es';
import Link from 'next/link';
import { stringifyUrl } from 'query-string';
import { MouseEventHandler, ReactNode } from 'react';

import { Permission } from '@account/const';
import { NAVIGATION_DROPDOWN, NavigationItem, NavigationLink } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import {
	NavigationInfo,
	NavigationPlacement,
} from '@navigation/services/navigation-service/navigation.types';
import { Icon, IconName, IconNamesLight } from '@shared/components';
import {
	ROUTE_PARTS_BY_LOCALE,
	ROUTE_PREFIXES_BY_LOCALE,
	ROUTES_BY_LOCALE,
} from '@shared/const/routes';
import { tText } from '@shared/helpers/translate';
import { Breakpoints, Visit } from '@shared/types';
import { Locale } from '@shared/utils';
import { SearchFilterId, VisitorSpaceInfo } from '@visitor-space/types';

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
	linkedSpaceOrId: string | null,
	locale: Locale
): NavigationItem => {
	const visitPath = ROUTES_BY_LOCALE[locale].visit;
	if (linkedSpaceOrId) {
		// Single link to go to linked visitor space (kiosk visitor)
		const searchRouteForSpace = `/${ROUTE_PARTS_BY_LOCALE[locale].search}?${SearchFilterId.Maintainer}=${linkedSpaceOrId}`;
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
		// No visitor spaces available => show link to /visit page without dropdown
		return {
			node: renderLink(navigationLabel, visitPath, {
				className: linkClasses,
			}),
			id: 'visitor-spaces',
			activeDesktop: currentPath === visitPath,
			activeMobile: currentPath === visitPath,
			path: currentPath,
		};
	} else {
		// Show dropdown list with bezoek page and accessible visitor spaces
		return {
			node: renderLink(navigationLabel, visitPath, {
				badge: <Badge text={accessibleVisitorSpaces.length} />,
				className: linkClasses,
				// Make link clickable in hamburger menu
				onClick: (e) => {
					if (window.innerWidth > Breakpoints.xxl) {
						e.preventDefault();
					}
				},
			}),
			id: 'visitor-spaces',
			path: currentPath,
			activeDesktop: currentPath === visitPath,
			activeMobile: currentPath === visitPath,
			children: [
				{
					node: renderLink(
						tText(
							'modules/navigation/components/navigation/navigation___alle-bezoekersruimtes'
						),
						visitPath,
						{
							className: dropdownCls('u-display-none', 'u-display-block:xxl'),
						}
					),
					id: 'all-visitor-spaces',
					path: currentPath,
					isDivider: accessibleVisitorSpaces.length > 0 ? 'md' : undefined,
				},
				...accessibleVisitorSpaces.map((visitorSpace: VisitorSpaceInfo): NavigationItem => {
					const searchRouteForSpace = `/${ROUTE_PARTS_BY_LOCALE[locale].search}?${SearchFilterId.Maintainer}=${visitorSpace.slug}`;
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
	linkedSpaceOrId: string | null,
	activeVisits: Visit[] | null,
	isMeemooAdmin = false,
	locale: Locale
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
			const hasActiveVisits = activeVisits && activeVisits.length > 0;
			const isSearchNavItem = contentPath === ROUTES_BY_LOCALE[locale].search;
			const searchUrl =
				isSearchNavItem && hasActiveVisits && !isMeemooAdmin
					? `${ROUTES_BY_LOCALE[locale].search}?aanbieder=${activeVisits[0].spaceSlug}`
					: contentPath;

			if (contentPath === NAVIGATION_DROPDOWN.VISITOR_SPACES) {
				return getVisitorSpacesDropdown(
					label,
					currentPath,
					accessibleVisitorSpaces,
					linkedSpaceOrId,
					locale
				);
			}

			return {
				activeDesktop: currentPath.includes(contentPath),
				activeMobile: currentPath.includes(contentPath),
				id,
				path: contentPath,
				node: renderLink(
					label,
					searchUrl,
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
	maintainerSlug: string | null,
	isMobile: boolean,
	locale: Locale
): NavigationItem[] => {
	if (
		intersection(permissions, [
			Permission.MANAGE_CP_VISIT_REQUESTS,
			Permission.MANAGE_CP_VISIT_REQUESTS,
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
				isMobile ? ROUTES_BY_LOCALE[locale].cpAdminVisitRequests : '',
				{
					className: linkClasses,
				}
			),
			id: 'nav__beheer',
			activeDesktop: currentPath.startsWith(`/${ROUTE_PREFIXES_BY_LOCALE[locale].cpAdmin}`),
			path: currentPath,
			children: [
				...(permissions.includes(Permission.MANAGE_CP_VISIT_REQUESTS)
					? [
							{
								node: renderLink(
									tText(
										'modules/navigation/components/navigation/navigation___aanvragen'
									),
									ROUTES_BY_LOCALE[locale].cpAdminVisitRequests,
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--aanvragen',
								path: currentPath,
								activeMobile: currentPath.startsWith(
									ROUTES_BY_LOCALE[locale].cpAdminVisitRequests
								),
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
									ROUTES_BY_LOCALE[locale].cpAdminMaterialRequests,
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--materiaalaanvragen',
								path: currentPath,
								activeMobile: currentPath.startsWith(
									ROUTES_BY_LOCALE[locale].cpAdminMaterialRequests
								),
							},
					  ]
					: []),
				...(permissions.includes(Permission.MANAGE_CP_VISIT_REQUESTS)
					? [
							{
								node: renderLink(
									tText(
										'modules/navigation/components/navigation/navigation___bezoekers'
									),
									ROUTES_BY_LOCALE[locale].cpAdminVisitors,
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--bezoekers',
								path: currentPath,
								activeMobile: currentPath.startsWith(
									ROUTES_BY_LOCALE[locale].cpAdminVisitors
								),
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
									ROUTES_BY_LOCALE[locale].cpAdminSettings,
									{
										className: dropdownCls(),
									}
								),
								id: 'nav__beheer--instellingen',
								path: currentPath,
								activeMobile: currentPath.startsWith(
									ROUTES_BY_LOCALE[locale].cpAdminSettings
								),
							},
					  ]
					: []),

				...(!isNil(maintainerSlug)
					? [
							{
								node: renderLink(
									tText(
										'modules/navigation/components/navigation/navigation___naar-mijn-bezoekerstool'
									),
									stringifyUrl({
										url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}`,
										query: {
											[SearchFilterId.Maintainer]: maintainerSlug,
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
	permissions: Permission[],
	locale: Locale
): NavigationItem[] => {
	if (
		intersection(permissions, [
			Permission.EDIT_ANY_CONTENT_PAGES,
			Permission.READ_ALL_SPACES,
			Permission.MANAGE_ALL_VISIT_REQUESTS,
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
				`/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}`,
				{
					className: linkClasses,
				}
			),
			id: 'nav__admin',
			activeDesktop: currentPath.startsWith(`/${ROUTE_PREFIXES_BY_LOCALE[locale].admin}`),
			activeMobile: currentPath.startsWith(`/${ROUTE_PREFIXES_BY_LOCALE[locale].admin}`),
			path: currentPath,
		},
	];
};

const getDivider = (id: string): NavigationItem =>
	({
		id,
		node: null,
		isDivider: 'md',
	}) as NavigationItem;

export const getNavigationItemsLeft = (
	currentPath: string,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	permissions: Permission[],
	linkedSpaceOrId: string | null,
	isMobile: boolean,
	maintainerSlug: string | null,
	activeVisits: Visit[] | null,
	isMeemooAdmin: boolean,
	locale: Locale
): NavigationItem[] => {
	const beforeDivider = getDynamicHeaderLinks(
		currentPath,
		navigationItems,
		NavigationPlacement.HeaderLeft,
		accessibleVisitorSpaces,
		linkedSpaceOrId,
		activeVisits,
		isMeemooAdmin,
		locale
	);
	const afterDivider = getDynamicHeaderLinks(
		currentPath,
		navigationItems,
		NavigationPlacement.HeaderRight,
		accessibleVisitorSpaces,
		linkedSpaceOrId,
		null,
		undefined,
		locale
	);

	const cpAdminLinks = getCpAdminManagementDropdown(
		currentPath,
		permissions,
		maintainerSlug,
		isMobile,
		locale
	);
	const meemooAdminLinks = getMeemooAdminManagementDropdown(currentPath, permissions, locale);

	return [
		// Some dynamic links from navigations table in database
		...beforeDivider,

		// Divider separate from the other items
		...(afterDivider.length > 0 ? [getDivider('divider-before-visitor-spaces')] : []),

		// Some dynamic links from navigations table in database
		...(isMobile ? [] : afterDivider),

		// Some hard coded links we always need to show on mobile
		...(isMobile ? [...cpAdminLinks, ...meemooAdminLinks] : []),
	];
};

export const getNavigationItemsProfileDropdown = (
	currentPath: string,
	navigationItems: Record<NavigationPlacement, NavigationInfo[]>,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	linkedSpaceOrId: string | null,
	locale: Locale
): NavigationItem[] => {
	const profileDropdown = getDynamicHeaderLinks(
		currentPath,
		navigationItems,
		NavigationPlacement.ProfileDropdown,
		accessibleVisitorSpaces,
		linkedSpaceOrId,
		null,
		undefined,
		locale
	);

	// Group navigation items by type
	const { defaultRoutes, adminRoutes, cpRoutes } = groupBy(
		profileDropdown,
		(navItem: NavigationItem) => {
			if (navItem.path?.startsWith('/' + ROUTE_PARTS_BY_LOCALE[locale].admin)) {
				return 'adminRoutes';
			}

			if (navItem.path?.startsWith('/' + ROUTE_PARTS_BY_LOCALE[locale].cpAdmin)) {
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
