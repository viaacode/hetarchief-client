import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import { toLower } from 'lodash-es';
import Link from 'next/link';
import { ReactNode } from 'react';

import { NavigationItem } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import { VisitorSpaceInfo } from '@reading-room/types';
import { Icon } from '@shared/components';
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
	}: {
		badge?: ReactNode;
		iconStart?: ReactNode;
		iconEnd?: ReactNode;
		className?: string;
	} = {}
): ReactNode => {
	return href ? (
		<Link href={href}>
			<a className={className} role="menuitem" tabIndex={0}>
				{iconStart && iconStart}
				{label}
				{badge && badge}
				{iconEnd && iconEnd}
			</a>
		</Link>
	) : (
		<a className={className} role="menuitem" tabIndex={0}>
			{iconStart && iconStart}
			{label}
			{badge && badge}
			{iconEnd && iconEnd}
		</a>
	);
};

export const getNavigationItemsLeft = (
	currentPath: string,
	accessibleReadingRooms: VisitorSpaceInfo[]
): NavigationItem[] => [
	{
		node: renderLink('Leeszalen', '', {
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
		id: 'leeszalen',
		active: currentPath === ROUTES.home || toLower(currentPath).startsWith('/or-'),
		children: [
			{
				node: renderLink('Alle leeszalen', '/', {
					className: dropdownCls(['u-display-none', 'u-display-block:md']),
				}),
				id: 'alle leeszalen',
				hasDivider: accessibleReadingRooms.length > 0 ? 'md' : undefined,
			},
			...accessibleReadingRooms.map(
				(visitorSpace: VisitorSpaceInfo): NavigationItem => ({
					node: renderLink(visitorSpace.name || '---', `/${visitorSpace.slug}`, {
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
					}),
					id: visitorSpace.id,
				})
			),
		],
	},
	// TODO replace this with links from the /navigations endpoint
	{
		node: renderLink('Over de leeszalen', '#', {
			className: linkCls([
				'u-color-black',
				'u-color-white:md',
				styles['c-navigation__link--dropdown'],
			]),
		}),
		id: 'over leeszalen',
		active: currentPath === '/over-leeszalen', // TODO: update once route is implemented
	},
	{
		node: renderLink('Vaak gestelde vragen', '#', {
			className: linkCls([
				'u-color-black',
				'u-color-white:md',
				styles['c-navigation__link--dropdown'],
			]),
		}),
		id: 'vragen',
		active: currentPath === '/vragen', // TODO: update once route is implemented
	},
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
		children: [
			// {
			// 	node: renderLink('Alle leeszalen', '/admin/leeszalenbeheer/leeszalen', {
			// 		className: dropdownCls(),
			// 	}),
			// 	id: 'nav__admin--leeszalen',
			// },
			// {
			// 	node: renderLink('Aanvragen', '/admin/leeszalenbeheer/aanvragen', {
			// 		className: dropdownCls(),
			// 	}),
			// 	id: 'nav__admin--aanvragen',
			// },
			// {
			// 	node: renderLink('Actieve bezoekers', '/admin/leeszalenbeheer/bezoekers', {
			// 		className: dropdownCls(),
			// 	}),
			// 	id: 'nav__admin--bezoekers',
			// },
		],
	},
];
