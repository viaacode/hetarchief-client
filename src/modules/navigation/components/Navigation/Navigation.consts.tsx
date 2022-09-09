import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import { intersection } from 'lodash-es';
import Link from 'next/link';
import { MouseEventHandler, ReactNode } from 'react';

import { Permission } from '@account/const';
import { NavigationItem } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import { NavigationInfo } from '@navigation/services/navigation-service/navigation.types';
import { Icon, IconName } from '@shared/components';
import { ROUTE_PARTS, ROUTE_PREFIXES, ROUTES } from '@shared/const';
import { TranslationService } from '@shared/services/translation-service/translation-service';
import { Breakpoints } from '@shared/types';
import { VisitorSpaceInfo } from '@visitor-space/types';

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
	} = {}
): ReactNode => {
	return href ? (
		<Link href={href}>
			<a
				aria-label={tooltip}
				className={className}
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
	) : (
		<a aria-label={tooltip} className={className} tabIndex={0} target={target} title={tooltip}>
			{iconStart && iconStart}
			{label}
			{badge && badge}
			{iconEnd && iconEnd}
		</a>
	);
};

const getVisitorSpacesDropdown = (
	currentPath: string,
	accessibleVisitorSpaces: VisitorSpaceInfo[],
	linkedSpaceSlug: string | null
): NavigationItem => {
	if (linkedSpaceSlug) {
		// Single link to go to linked visitor space (kiosk visitor)
		return {
			node: renderLink(
				TranslationService.getTranslation(
					'modules/navigation/components/navigation/navigation___bezoekersruimte'
				),
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
			node: renderLink(
				TranslationService.getTranslation(
					'modules/navigation/components/navigation/navigation___bezoekersruimtes'
				),
				'/',
				{
					className: linkClasses,
				}
			),
			id: 'visitor-spaces',
			activeDesktop: currentPath === ROUTES.home,
			activeMobile: currentPath === ROUTES.home,
		};
	} else {
		// Show dropdown list with homepage and accessible visitor spaces
		return {
			node: renderLink(
				TranslationService.getTranslation(
					'modules/navigation/components/navigation/navigation___bezoekersruimtes'
				),
				'/',
				{
					badge: <Badge text={accessibleVisitorSpaces.length} />,
					className: linkClasses,
					// Make link clickable in hamburger menu
					onClick: (e) => {
						if (window.innerWidth > Breakpoints.md) {
							e.preventDefault();
						}
					},
				}
			),
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
						TranslationService.getTranslation(
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
									TranslationService.getTranslation(
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
						activeMobile: currentPath.startsWith(`/${visitorSpace.slug}`),
					})
				),
			],
		};
	}
};

const getDynamicHeaderLinks = (currentPath: string, navigationItems: NavigationInfo[]) => {
	return navigationItems.map((navigationItem: NavigationInfo): NavigationItem => {
		return {
			activeDesktop: currentPath === navigationItem.contentPath,
			activeMobile: currentPath === navigationItem.contentPath,
			id: navigationItem.id,
			node: renderLink(navigationItem.label, navigationItem.contentPath, {
				target: navigationItem.linkTarget || undefined,
				iconStart: navigationItem.iconName ? (
					<Icon name={navigationItem.iconName as IconName} />
				) : null,
				tooltip: navigationItem.tooltip || undefined,
				className: linkClasses,
			}),
		};
	});
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
				TranslationService.getTranslation(
					'modules/navigation/components/navigation/navigation___beheer'
				),
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
									TranslationService.getTranslation(
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
									TranslationService.getTranslation(
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
									TranslationService.getTranslation(
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
				TranslationService.getTranslation(
					'modules/navigation/components/navigation/navigation___admin'
				),
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
	navigationItems: NavigationInfo[],
	permissions: Permission[],
	linkedSpaceSlug: string | null,
	isMobile: boolean
): NavigationItem[] => {
	const cpAdminLinks = getCpAdminManagementDropdown(currentPath, permissions, isMobile);
	const meemooAdminLinks = getMeemooAdminManagementDropdown(currentPath, permissions);

	return [
		// Visitor space dropdown
		getVisitorSpacesDropdown(currentPath, accessibleVisitorSpaces, linkedSpaceSlug),

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
