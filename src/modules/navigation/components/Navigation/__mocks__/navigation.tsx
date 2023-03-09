import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Icon, IconNamesLight } from '@shared/components';

import styles from '../Navigation.module.scss';
import { NavigationItem } from '../Navigation.types';
import { NavigationHamburgerProps } from '../NavigationSection';

const linkCls = (...classNames: string[]) => {
	return clsx(styles['c-navigation__link'], ...classNames);
};

const dropdownCls = (...classNames: string[]) => {
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
	openLabel: 'Sluit',
	closedLabel: 'Menu',
	openIcon: IconNamesLight.Times,
	closedIcon: IconNamesLight.GridView,
};

export const MOCK_ITEMS_LEFT: NavigationItem[] = [
	{
		node: renderLink('bezoekersruimtes', '', {
			badge: <Badge text="2" />,
			className: linkCls(
				'u-color-black',
				'u-color-white:xxl',
				'u-whitespace-nowrap',
				styles['c-navigation__link--dropdown']
			),
		}),
		id: 'bezoekersruimtes',
		activeDesktop: true,
		path: '',
		children: [
			{
				node: renderLink('Alle bezoekersruimtes', '/', {
					className: dropdownCls('u-display-none', 'u-display-block:xxl'),
				}),
				id: 'alle bezoekersruimtes',
				isDivider: 'md',
				path: '',
			},
			{
				node: renderLink('VRT', `/OR-vrt123`, {
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
				}),
				id: 'vrt',
				path: '',
			},
			{
				node: renderLink('Huis van Alijn', `/OR-huisvanalijn456`, {
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
				}),
				path: '',
				id: 'huisvanalijn',
			},
		],
	},
	{
		node: renderLink('Over de bezoekersruimtes', '#', {
			className: linkCls(
				'u-color-black',
				'u-color-white:xxl',
				styles['c-navigation__link--dropdown']
			),
		}),
		path: '',
		id: 'over bezoekersruimtes',
	},
	{
		node: renderLink('Vaak gestelde vragen', '#', {
			className: linkCls(
				'u-color-black',
				'u-color-white:xxl',
				styles['c-navigation__link--dropdown']
			),
		}),
		id: 'vragen',
		path: '',
	},
	{
		node: renderLink('Beheer', '', {
			className: linkCls(
				'u-color-black',
				'u-color-white:xxl',
				styles['c-navigation__link--dropdown']
			),
		}),
		id: 'nav__beheer',
		isDivider: 'md',
		path: '',
		children: [
			{
				node: renderLink('Aanvragen', '/beheer/toegangsaanvragen', {
					className: dropdownCls(),
				}),
				id: 'nav__beheer--toegangsaanvragen',
				path: '',
			},
			{
				node: renderLink('Bezoekers', '/beheer/bezoekers', {
					className: dropdownCls(),
				}),
				id: 'nav__beheer--bezoekers',
				path: '',
			},
			{
				node: renderLink('Instellingen', '/beheer/instellingen', {
					className: dropdownCls(),
				}),
				id: 'nav__beheer--instellingen',
				path: '',
			},
		],
	},
];

export const MOCK_ITEMS_RIGHT: NavigationItem[] = [
	{
		node: renderLink('Inloggen of registreren', '#', { className: linkCls('u-text-right') }),
		id: 'auth log in',
		path: '',
		children: [
			{
				node: renderLink('Mijn profiel', '#', {
					className: dropdownCls(),
				}),
				id: 'profiel',
				path: '',
			},
			{
				node: renderLink('Mijn mappen', '#', {
					className: dropdownCls(),
				}),
				id: 'mappen',
				path: '',
			},
			{
				node: renderLink('Mijn historiek', '#', {
					className: dropdownCls(),
				}),
				id: 'historiek',
				path: '',
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
							name={IconNamesLight.LogOut}
						/>
					),
				}),
				id: 'auth log uit',
				path: '',

				isDivider: true,
			},
		],
	},
];
