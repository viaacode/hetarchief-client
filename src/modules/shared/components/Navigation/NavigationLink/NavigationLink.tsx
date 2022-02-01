import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

import styles from '../Navigation.module.scss';

import { NavigationLinkProps } from './NavigationLink.types';

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

	const renderLabelWithIcons = () => (
		<>
			{iconStart}
			{label}
			{iconEnd}
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
