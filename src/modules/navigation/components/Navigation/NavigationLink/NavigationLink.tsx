import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

import { Icon, type IconProps } from '@shared/components/Icon';
import { tText } from '@shared/helpers/translate';

import styles from '../Navigation.module.scss';

import type { NavigationLinkIcon, NavigationLinkProps } from './NavigationLink.types';

const NavigationLink: FC<NavigationLinkProps> = ({
	className,
	href,
	iconStart,
	iconEnd,
	isDropdown = false,
	isDropdownItem = false,
	label,
	onClick,
}) => {
	const rootCls = clsx(
		className,
		isDropdownItem ? 'c-dropdown-menu__item' : styles['c-navigtion__link'],
		{
			[styles['c-navigation__link--dropdown']]: isDropdown,
		}
	);

	const clickProps = onClick ? { role: 'button', tabIndex: 0, onClick } : null;

	const renderIcon = (icon: NavigationLinkIcon | undefined, side: 'start' | 'end') => {
		return (
			icon && (
				<Icon
					className={clsx(
						styles['c-navigation__dropdown-icon'],
						styles[`c-navigation__dropdown-icon--${side}`]
					)}
					{...(typeof iconStart === 'string' ? { name: iconStart } : (iconStart as IconProps))}
				/>
			)
		);
	};

	const renderLabelWithIcons = () => (
		<>
			{renderIcon(iconStart, 'start')}
			{label}
			{renderIcon(iconEnd, 'end')}
		</>
	);

	return href ? (
		<Link
			href={href}
			passHref
			className={rootCls}
			aria-label={tText(
				'modules/navigation/components/navigation/navigation-link/navigation-link___navigeer-naar-een-pagina'
			)}
		>
			{renderLabelWithIcons()}
		</Link>
	) : (
		<span className={rootCls} {...clickProps}>
			{renderLabelWithIcons()}
		</span>
	);
};

export default NavigationLink;
