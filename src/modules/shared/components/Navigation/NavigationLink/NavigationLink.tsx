import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

import { Icon, IconProps } from '@shared/components';

import styles from '../Navigation.module.scss';

import { NavigationLinkIcon, NavigationLinkProps } from './NavigationLink.types';

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
					{...(typeof iconStart === 'string'
						? { name: iconStart }
						: (iconStart as IconProps))}
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
		<Link href={href} passHref>
			<a className={rootCls}>{renderLabelWithIcons()}</a>
		</Link>
	) : (
		<span className={rootCls} {...clickProps}>
			{renderLabelWithIcons()}
		</span>
	);
};

export default NavigationLink;
