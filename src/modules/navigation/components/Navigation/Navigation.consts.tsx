import { Badge } from '@meemoo/react-components';
import clsx from 'clsx';
import { i18n } from 'next-i18next';
import Link from 'next/link';
import { ReactNode } from 'react';

import { NavigationItem } from '@navigation/components';
import styles from '@navigation/components/Navigation/Navigation.module.scss';
import { NavigationInfo } from '@navigation/services/navigation-service/navigation.types';
import { VisitorSpaceInfo } from '@reading-room/types';
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
	accessibleReadingRooms: VisitorSpaceInfo[],
	navigationItems: NavigationInfo[]
): NavigationItem[] => [
	{
		node: renderLink(
			i18n?.t('modules/navigation/components/navigation/navigation___bezoekersruimtes') ||
				'Bezoekersruimtes',
			'',
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
					i18n?.t(
						'modules/navigation/components/navigation/navigation___alle-bezoekersruimtes'
					) || 'Alle bezoekersruimtes',
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
					node: renderLink(
						visitorSpace.name ||
							i18n?.t(
								'modules/navigation/components/navigation/navigation___bezoekersruimte'
							) ||
							'',
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
						}
					),
					id: visitorSpace.id,
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
		node: renderLink('Admin', '', {
			className: linkCls([
				'u-color-black',
				'u-color-white:md',
				styles['c-navigation__link--dropdown'],
			]),
		}),
		id: 'nav__admin',
		active: currentPath.startsWith('/admin'),
		children: [
			{
				node: renderLink('Alle leeszalen', '/admin/leeszalenbeheer/leeszalen', {
					className: dropdownCls(),
				}),
				id: 'nav__admin--leeszalen',
			},
			{
				node: renderLink('Aanvragen', '/admin/leeszalenbeheer/aanvragen', {
					className: dropdownCls(),
				}),
				id: 'nav__admin--aanvragen',
			},
			{
				node: renderLink('Actieve bezoekers', '/admin/leeszalenbeheer/bezoekers', {
					className: dropdownCls(),
				}),
				id: 'nav__admin--bezoekers',
			},
		],
	},
];
