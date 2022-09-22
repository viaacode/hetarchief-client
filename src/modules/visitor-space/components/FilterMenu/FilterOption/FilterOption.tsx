import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useState } from 'react';

import { Icon, Overlay } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { FilterButton } from '../FilterButton';
import FilterForm from '../FilterForm/FilterForm';
import styles from '../FilterMenu.module.scss';

import { FilterOptionProps } from './FilterOption.types';

const FilterOption: FC<FilterOptionProps> = ({
	activeFilter,
	form,
	icon,
	id,
	label,
	onClick,
	onFormReset,
	onFormSubmit,
	values,
}) => {
	const { tText } = useTranslation();

	const filterIsActive = id === activeFilter;
	const flyoutCls = clsx(
		styles['c-filter-menu__flyout'],
		styles['c-filter-menu__flyout--filter']
	);

	const onFilterToggle = useCallback(() => onClick?.(id), [id, onClick]);
	const [openedAt, setOpenedAt] = useState<number | undefined>(undefined);

	// re-render form to ensure correct state
	// e.g. open -> reset -> close -> open === values in url, in form
	useEffect(() => {
		setOpenedAt(new Date().valueOf());
	}, [filterIsActive]);

	return (
		<>
			<Dropdown
				className={styles['c-filter-menu__option']}
				flyoutClassName={flyoutCls}
				isOpen={filterIsActive}
				key={`filter-menu-btn-${id}`}
				onClose={onFilterToggle}
				onOpen={onFilterToggle}
				placement="right"
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
						icon={<Icon name="times" aria-hidden />}
						aria-label={tText(
							'modules/visitor-space/components/filter-menu/filter-option/filter-option___sluiten'
						)}
						onClick={onFilterToggle}
						variants="text"
					/>
					<FilterForm
						className={styles['c-filter-menu__form']}
						form={form}
						id={id}
						key={openedAt}
						onFormReset={onFormReset}
						onFormSubmit={onFormSubmit}
						title={label}
						values={values}
						disabled={!filterIsActive}
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
