import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

import { NavigationItem } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import { NavigationInfo } from '@navigation/services/navigation-service/navigation.types';
import { VisitorSpaceInfo } from '@reading-room/types';
import { Icon, IconName } from '@shared/components';
import { ROUTES } from '@shared/const';
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
			node: renderLink(i18n.t('bezoekersruimte'), '/' + linkedSpaceSlug, {
				badge: null,
				className: linkCls(['u-color-black', 'u-color-white:md', 'u-whitespace-nowrap']),
			}),
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
					hasDivider: accessibleReadingRooms.length > 0 ? 'md' : undefined,
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

export const getNavigationItemsLeft = (
	currentPath: string,
	accessibleReadingRooms: VisitorSpaceInfo[],
	navigationItems: NavigationInfo[],
	linkedSpaceSlug: string | null
): NavigationItem[] => [
	// Visitor space dropdown
	getVisitorSpacesDropdown(currentPath, accessibleReadingRooms, linkedSpaceSlug),

	// Some dynamic links from navigations table in database
	...navigationItems.map((navigationItem: NavigationInfo): NavigationItem => {
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
	}),

	// CP Admin dropdown link
	{
		node: renderLink('Beheer', '', {
			className: linkCls([
				'u-color-black',
				'u-color-white:md',
				styles['c-navigation__link--dropdown'],
			]),
		}),
		id: 'nav__beheer',
		active: currentPath.startsWith('/beheer'),
		hasDivider: 'md',
		children: [
			{
				node: renderLink('Aanvragen', '/beheer/aanvragen', {
					className: dropdownCls(),
				}),
				id: 'nav__beheer--aanvragen',
			},
			{
				node: renderLink('Bezoekers', '/beheer/bezoekers', {
					className: dropdownCls(),
				}),
				id: 'nav__beheer--bezoekers',
			},
			{
				node: renderLink('Instellingen', '/beheer/instellingen', {
					className: dropdownCls(),
				}),
				id: 'nav__beheer--instellingen',
			},
		],
	},

	// Meemoo admin link
	{
		node: renderLink('Admin', '/admin/leeszalenbeheer/aanvragen', {
			className: linkCls([
				'u-color-black',
				'u-color-white:md',
				styles['c-navigation__link--dropdown'],
			]),
		}),
		id: 'nav__admin',
		active: currentPath.startsWith('/admin'),
	},
];
