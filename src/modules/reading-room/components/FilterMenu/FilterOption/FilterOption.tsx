import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useCallback } from 'react';

import { Icon, Overlay } from '@shared/components';

import { FilterButton } from '../FilterButton';
import FilterForm from '../FilterForm/FilterForm';
import styles from '../FilterMenu.module.scss';

import { FilterOptionProps } from './FilterOption.types';

const FilterOption: FC<FilterOptionProps> = ({
	activeFilter,
	values,
	form,
	icon,
	id,
	label,
	onClick,
	onFormReset,
	onFormSubmit,
}) => {
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
					<Button
						className={styles['c-filter-menu__flyout-close']}
						icon={<Icon name="times" />}
						variants="text"
						onClick={onFilterToggle}
					/>
					<FilterForm
						className={styles['c-filter-menu__form']}
						form={form}
						id={id}
						title={label}
						values={values}
						onFormReset={onFormReset}
						onFormSubmit={onFormSubmit}
					/>
				</DropdownContent>
			</Dropdown>
			<Overlay
				className={styles['c-filter-menu__overlay']}
				visible={filterIsActive}
				onClick={onFilterToggle}
			/>
		</>
	);
};

export default FilterOption;
