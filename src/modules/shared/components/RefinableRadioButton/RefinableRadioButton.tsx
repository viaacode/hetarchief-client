import { Dropdown, RadioButton } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil, without } from 'lodash';
import { FC, ReactElement, ReactNode, useEffect, useState } from 'react';

import { CheckboxList } from '../CheckboxList';
import { Icon, IconNamesLight } from '../Icon';

import styles from './RefinableRadioButton.module.scss';
import {
	RefinableRadioButtonOption,
	RefinableRadioButtonProps,
	RefinableRadioButtonRefine,
	RefinableRadioButtonRefineOption,
} from './RefinableRadioButton.types';

export const RefinableRadioButton: FC<RefinableRadioButtonProps> = ({
	options,
	initialState,
	onChange,
	className,
}: RefinableRadioButtonProps): ReactElement => {
	const [selectedOption, setSelectedOption] = useState<string>(initialState.selectedOption);
	const [selectedRefineOptions, setSelectedRefineOptions] = useState<string[]>(
		initialState.refinedSelection
	);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	const onRadioButtonClick = (id: string): void => {
		setSelectedOption(id);
		setSelectedRefineOptions([]);
	};

	const onCheckboxClick = (checked: boolean, value: unknown): void => {
		// If not checked yet, we need to add the value to the list of selected items, otherwise remove it
		// This list will be used to check wheter an option should have the checked property or not, that's why the check is "reversed" here.
		const selected = !checked
			? [...selectedRefineOptions, `${value}`]
			: without(selectedRefineOptions, `${value}`);

		setSelectedRefineOptions(selected);
	};

	const renderRefineOptions = (
		{ options, label, info }: RefinableRadioButtonRefine,
		optionId: string
	): ReactNode => {
		if (isEmpty(options)) {
			return;
		}

		const isDisabled = selectedOption !== optionId;

		return (
			<div
				className={clsx(className, styles['c-refinable-radio-button__refine'], {
					[styles['c-refinable-radio-button__refine--disabled']]: isDisabled,
				})}
			>
				<Dropdown
					variants="bordered"
					isDisabled={isDisabled}
					className={styles['c-refinable-radio-button__dropdown']}
					label={label}
					isOpen={isDropdownOpen}
					onOpen={() => setIsDropdownOpen(true)}
					onClose={() => setIsDropdownOpen(false)}
					iconOpen={<Icon name={IconNamesLight.AngleUp} />}
					iconClosed={<Icon name={IconNamesLight.AngleDown} />}
				>
					<CheckboxList
						className={styles['c-refinable-radio-button__checkbox-list']}
						itemClassName={styles['c-refinable-radio-button__checkbox-list-item']}
						items={options.map(({ id, label }: RefinableRadioButtonRefineOption) => ({
							value: id,
							label,
							checked: selectedRefineOptions.includes(id),
						}))}
						checkIcon={<Icon name={IconNamesLight.Check} />}
						onItemClick={onCheckboxClick}
					/>
				</Dropdown>
				{info && (
					<p className={styles['c-refinable-radio-button__dropdown-info']}>{info}</p>
				)}
			</div>
		);
	};

	useEffect(() => {
		onChange(selectedOption, selectedRefineOptions, isDropdownOpen);
	}, [isDropdownOpen, onChange, selectedOption, selectedRefineOptions]);

	return (
		<div className={styles['c-refinable-radio-button']}>
			<ul className={clsx(styles['c-refinable-radio-button__list'], 'u-list-reset')}>
				{options.map(
					({ id, label, refine }: RefinableRadioButtonOption): ReactNode => (
						<li key={id} className="u-my-8">
							<RadioButton
								key={id}
								label={label}
								checked={selectedOption === id}
								onClick={() => onRadioButtonClick(id)}
								className={styles['c-refinable-radio-button__option']}
							/>
							{!isNil(refine) && renderRefineOptions(refine, id)}
						</li>
					)
				)}
			</ul>
		</div>
	);
};
