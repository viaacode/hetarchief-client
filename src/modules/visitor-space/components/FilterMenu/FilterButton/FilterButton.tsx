import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from '../FilterMenu.module.scss';

import type { FilterButtonProps } from './FilterButton.types';

const FilterButton: FC<FilterButtonProps> = ({
	className,
	label,
	ariaLabel,
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
			ariaLabel={ariaLabel || (typeof label === 'string' ? label : undefined)}
			variants={['black', 'block']}
			onClick={onClick}
			type="button"
			onKeyDown={(e) => e.code === 'Enter' && onClick?.()}
		/>
	);
};

export default FilterButton;
