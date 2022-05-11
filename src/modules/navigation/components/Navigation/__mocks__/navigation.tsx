import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Icon } from '@shared/components';

import styles from '../Navigation.module.scss';
import { NavigationItem } from '../Navigation.types';
import { NavigationHamburgerProps } from '../NavigationSection';

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

export const MOCK_HAMBURGER_PROPS: NavigationHamburgerProps = {
	openLabel: 'sluit',
	closedLabel: 'Menu',
	openIcon: 'times',
	closedIcon: 'grid-view',
};

export const MOCK_ITEMS_LEFT: NavigationItem[] = [
	{
		node: renderLink('Leeszalen', '', {
			badge: <Badge text="2" />,
			className: linkCls([
				'u-color-black',
				'u-color-white:md',
				'u-whitespace-nowrap',
				styles['c-navigation__link--dropdown'],
			]),
		}),
		id: 'leeszalen',
		activeDesktop: true,
		children: [
			{
				node: renderLink('Alle leeszalen', '/', {
					className: dropdownCls(['u-display-none', 'u-display-block:md']),
				}),
				id: 'alle leeszalen',
				isDivider: 'md',
			},
			{
				node: renderLink('VRT', `/OR-vrt123`, {
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
				id: 'vrt',
			},
			{
				node: renderLink('Huis van Alijn', `/OR-huisvanalijn456`, {
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
				id: 'huisvanalijn',
			},
		],
	},
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
		isDivider: 'md',
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
];

export const MOCK_ITEMS_RIGHT: NavigationItem[] = [
	{
		node: renderLink('Inloggen of registreren', '#', { className: linkCls(['u-text-right']) }),
		id: 'auth log in',
		children: [
			{
				node: renderLink('Mijn profiel', '#', {
					className: dropdownCls(),
				}),
				id: 'profiel',
			},
			{
				node: renderLink('Mijn mappen', '#', {
					className: dropdownCls(),
				}),
				id: 'mappen',
			},
			{
				node: renderLink('Mijn historiek', '#', {
					className: dropdownCls(),
				}),
				id: 'historiek',
			},
			{
				node: renderLink('Log uit', '#', {
					className: dropdownCls(),
					iconStart: (
						<Icon
							className={clsx(
								'u-font-size-24',
								'u-text-left',
								styles['c-navigation__dropdown-icon--start']
							)}
							name="log-out"
						/>
					),
				}),
				id: 'auth log uit',
				isDivider: true,
			},
		],
	},
];
