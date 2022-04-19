import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

import { NavigationItem } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import { NavigationInfo } from '@navigation/services/navigation-service/navigation.types';
import { ReadingRoomInfo } from '@reading-room/types';
import { Icon, IconName } from '@shared/components';
import { ROUTES } from '@shared/const';

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
	}: {
		badge?: ReactNode;
		iconStart?: ReactNode;
		iconEnd?: ReactNode;
		className?: string;
		tooltip?: string;
		target?: string;
	} = {}
): ReactNode => {
	return href ? (
		<Link href={href}>
			<a className={className} role="menuitem" tabIndex={0} title={tooltip} target={target}>
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

export const getNavigationItemsLeft = (
	currentPath: string,
	accessibleReadingRooms: ReadingRoomInfo[],
	navigationItems: NavigationInfo[]
): NavigationItem[] => {
	return [
		{
			node: renderLink('Bezoekersruimtes', '', {
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
			}),
			id: 'visitor-spaces',
			active: currentPath === ROUTES.home,
			children: [
				{
					node: renderLink('Alle bezoekersruimtes', '/', {
						className: dropdownCls(['u-display-none', 'u-display-block:md']),
					}),
					id: 'all-visitor-spaces',
					hasDivider: accessibleReadingRooms.length > 0 ? 'md' : undefined,
				},
				...accessibleReadingRooms.map(
					(readingRoom: ReadingRoomInfo): NavigationItem => ({
						// TODO update the link to use the readingRoom.slug instead of the id
						node: renderLink(
							readingRoom.name || '---',
							`/${readingRoom.maintainerId.toLowerCase()}`,
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
							}
						),
						id: readingRoom.id,
					})
				),
			],
		},
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
};
