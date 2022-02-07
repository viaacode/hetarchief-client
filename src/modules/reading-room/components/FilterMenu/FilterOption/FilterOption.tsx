import { Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useCallback } from 'react';

import { Overlay } from '@shared/components';

import { FilterButton } from '../FilterButton';
import styles from '../FilterMenu.module.scss';

import { FilterOptionProps } from './FilterOption.types';

const FilterOption: FC<FilterOptionProps> = ({ activeFilter, icon, id, label, onClick }) => {
	const filterIsActive = id === activeFilter;
	const flyoutCls = clsx(
		styles['c-filter-menu__flyout'],
		styles['c-filter-menu__flyout--filter']
	);

	const onFilterToggle = useCallback(() => onClick?.(id), [id, onClick]);

	return (
		<>
			<Dropdown
				key={`filter-menu-btn-${id}`}
				className={styles['c-filter-menu__option']}
				flyoutClassName={flyoutCls}
				isOpen={filterIsActive}
				placement="right"
				onOpen={onFilterToggle}
				onClose={onFilterToggle}
			>
				<DropdownButton>
					<FilterButton
						icon={filterIsActive ? 'angle-left' : icon ?? 'angle-right'}
						isActive={filterIsActive}
						label={label}
					/>
				</DropdownButton>
				<DropdownContent>
					<div>Add form component here</div>
				</DropdownContent>
			</Dropdown>
			<Overlay
				className={clsx(styles['c-filter-menu__overlay'])}
				visible={filterIsActive}
				onClick={onFilterToggle}
			/>
		</>
	);
};

export default FilterOption;
