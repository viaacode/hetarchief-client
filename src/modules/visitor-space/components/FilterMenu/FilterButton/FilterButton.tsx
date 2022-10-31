import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '@shared/components';

import styles from '../FilterMenu.module.scss';

import { FilterButtonProps } from './FilterButton.types';

const FilterButton: FC<FilterButtonProps> = ({
	className,
	label,
	icon,
	isActive,
	type = 'filter',
	onClick,
}) => {
	const filterBtnCls = clsx(className, styles['c-filter-menu__button'], {
		[styles['c-filter-menu__button--active']]: isActive,
		[styles['c-filter-menu__button--sort']]: type === 'sort',
	});

	return (
		<Button
			tabIndex={0}
			role="button"
			className={filterBtnCls}
			iconEnd={<Icon className="u-text-left" name={icon} aria-hidden />}
			label={label}
			variants={['black', 'block']}
			onClick={onClick}
			type="button"
			onKeyDown={(e) => e.code !== 'Tab' && e.preventDefault()}
		/>
	);
};

export default FilterButton;
