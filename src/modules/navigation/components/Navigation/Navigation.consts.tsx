import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

import { NavigationItem } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import { ReadingRoomInfo } from '@reading-room/types';
import { Icon } from '@shared/components';

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
	accessibleReadingRooms: ReadingRoomInfo[]
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
		active: true,
		children: [
			{
				node: renderLink('Alle leeszalen', '/', {
					className: dropdownCls(['u-display-none', 'u-display-block:md']),
				}),
				id: 'alle leeszalen',
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
