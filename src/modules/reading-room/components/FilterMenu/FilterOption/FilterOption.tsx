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

	useEffect(() => {
		const closeOnEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && filterIsActive) {
				onFilterToggle();
			}
		};

		window.addEventListener('keydown', closeOnEsc);

		return () => {
			window.removeEventListener('keydown', closeOnEsc);
		};
	}, [filterIsActive, onFilterToggle]);

	return (
		<>
			<Dropdown
				key={`filter-menu-btn-${id}`}
				className={styles['c-filter-option']}
				flyoutClassName={styles['c-filter-option__flyout']}
				isOpen={filterIsActive}
				placement="right"
			>
				<DropdownButton>
					<Button
						className={filterBtnCls}
						iconEnd={<Icon name={iconName} />}
						label={label}
						variants={['black', 'block']}
						onClick={onFilterToggle}
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
