import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Icon } from '@shared/components';

import styles from '../Navigation.module.scss';
import { NavigationItem } from '../Navigation.types';

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
	return (
		<Link href={href}>
			<a className={className} role="menuitem" tabIndex={0} key={'leeszalen'}>
				{iconStart && iconStart}
				{label}
				{badge && badge}
				{iconEnd && iconEnd}
			</a>
		</Link>
	);
};

export const MOCK_ITEMS_LEFT: NavigationItem[] = [
	{
		node: renderLink('Leeszalen', '#', {
			badge: <Badge text="2" />,
			className: linkCls([
				'u-color-black',
				'u-color-white:md',
				styles['c-navigation__link--dropdown'],
			]),
		}),
		id: 'leeszalen',
		active: true,
		children: [
			{
				node: renderLink('Alle leeszalen', '#', {
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
					className: dropdownCls(['u-display-none', 'u-display-block:md']),
				}),
				id: 'alle leeszalen',
			},
			{
				node: renderLink('Leeszaal 8', '/leeszaal/leeszaal-8', {
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
				id: 'leeszaal 8',
			},
			{
				node: renderLink('Leeszaal 12', '/leeszaal/leeszaal-12', {
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
				id: 'leeszaal 12',
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
		node: renderLink('Beheer', '#', {
			className: linkCls([
				'u-color-black',
				'u-color-white:md',
				styles['c-navigation__link--dropdown'],
			]),
		}),
		id: 'beheer',
		hasDivider: true,
		children: [
			{
				node: renderLink('Aanvragen', '#', {
					className: dropdownCls(),
				}),
				id: 'aanvragen',
			},
			{
				node: renderLink('Bezoekers', '#', {
					className: dropdownCls(),
				}),
				id: 'bezoekers',
			},
			{
				node: renderLink('Instellingen', '#', {
					className: dropdownCls(),
				}),
				id: 'instellingen',
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
				hasDivider: true,
			},
		],
	},
];
