import { Dropdown } from '@meemoo/react-components';
import clsx from 'clsx';
import { without } from 'lodash-es';
import { FC, ReactElement, useEffect, useState } from 'react';

import { CheckboxList } from '../CheckboxList';
import { Icon, IconNamesLight } from '../Icon';

import styles from './MultiSelect.module.scss';
import { MultiSelectOption, MultiSelectProps } from './MultiSelect.types';

export const MultiSelect: FC<MultiSelectProps> = ({
	className,
	label,
	options,
	onChange,
	variant = 'bordered',
}): ReactElement => {
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

	useEffect(() => {
		onChange(selectedOptions);
	}, [onChange, selectedOptions]);

	const onCheckboxClick = (checked: boolean, value: unknown): void => {
		// If not checked yet, we need to add the value to the list of selected items, otherwise remove it
		// This list will be used to check whether an option should have the checked property or not, that's why the check is "reversed" here.
		const selected = !checked
			? [...selectedOptions, `${value}`]
			: without(selectedOptions, `${value}`);

		setSelectedOptions(selected);
	};

	const getLabel = () => {
		if (selectedOptions.length) {
			return `${label} (${selectedOptions.length})`;
		}
		return label;
	};

	return (
		<div className={clsx(className, styles['c-multi-select'])}>
			<Dropdown
				variants={variant}
				className={styles['c-multi-select__dropdown']}
				label={getLabel()}
				isOpen={isDropdownOpen}
				onOpen={() => setIsDropdownOpen(true)}
				onClose={() => setIsDropdownOpen(false)}
				iconOpen={<Icon name={IconNamesLight.AngleUp} />}
				iconClosed={<Icon name={IconNamesLight.AngleDown} />}
			>
				<CheckboxList
					checkIcon={<Icon name={IconNamesLight.Check} />}
					className={styles['c-multi-select__checkbox-list']}
					itemClassName={styles['c-multi-select__checkbox-list-item']}
					items={options.map(({ id, label }: MultiSelectOption) => ({
						value: id,
						label,
						checked: selectedOptions.includes(id),
					}))}
					onItemClick={onCheckboxClick}
				/>
			</Dropdown>
		</div>
	);
};
