import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useCallback, useEffect } from 'react';

import { Icon, Overlay } from '@shared/components';

import styles from './FilterOption.module.scss';
import { FilterOptionProps } from './FilterOption.types';

const FilterOption: FC<FilterOptionProps> = ({
	activeFilter,
	className,
	icon,
	id,
	label,
	onClick,
}) => {
	const filterIsActive = id === activeFilter;
	const filterBtnCls = clsx(className, styles['c-filter-option__button'], {
		[styles['c-filter-option__button--active']]: filterIsActive,
	});
	const iconName = filterIsActive ? 'angle-left' : icon ?? 'angle-right';

	const onFilterToggle = useCallback(() => onClick?.(id), [id, onClick]);

	return (
		<>
			<Dropdown
				key={`filter-menu-btn-${id}`}
				className={styles['c-filter-option']}
				flyoutClassName={styles['c-filter-option__flyout']}
				isOpen={filterIsActive}
				placement="right"
				onOpen={onFilterToggle}
				onClose={onFilterToggle}
			>
				<DropdownButton>
					<Button
						className={filterBtnCls}
						iconEnd={<Icon name={iconName} />}
						label={label}
						variants={['black', 'block']}
					/>
				</DropdownButton>
				<DropdownContent>
					<div>Add form component here</div>
				</DropdownContent>
			</Dropdown>
			<Overlay
				className={styles['c-filter-option__overlay']}
				visible={filterIsActive}
				onClick={onFilterToggle}
			/>
		</>
	);
};

export default FilterOption;
