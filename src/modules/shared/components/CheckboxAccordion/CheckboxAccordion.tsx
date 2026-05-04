import { Button, Checkbox, FormControl, TextArea } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { useState } from 'react';
import styles from './CheckboxAccordion.module.scss';
import type { CheckboxAccordionOption, CheckboxAccordionProps } from './CheckboxAccordion.types';

function CheckboxAccordion<ValueType>({
	className,
	title,
	options,
	selectedOptions,
	onChange,
	error,
	showValidation = false,
}: CheckboxAccordionProps<ValueType>) {
	const [openOptions, setOpenOptions] = useState<Set<ValueType>>(new Set());

	const toggleOpenOption = (value: ValueType) => {
		const newOpenOptions = new Set(openOptions);
		if (newOpenOptions.has(value)) {
			newOpenOptions.delete(value);
		} else {
			newOpenOptions.add(value);
		}
		setOpenOptions(newOpenOptions);
	};

	const handleCheckboxChange = (value: ValueType, checked: boolean) => {
		if (checked) {
			// Add with empty string if not already present
			const existingItem = selectedOptions.find((item) => item.type === value);
			if (!existingItem) {
				onChange([...selectedOptions, { type: value, text: '' }]);
			}
			// Open the accordion when checkbox is checked
			const newOpenOptions = new Set(openOptions);
			newOpenOptions.add(value);
			setOpenOptions(newOpenOptions);
		} else {
			// Remove from selected
			onChange(selectedOptions.filter((item) => item.type !== value));
		}
	};

	const handleTextChange = (value: ValueType, text: string) => {
		const existingItem = selectedOptions.find((item) => item.type === value);

		// If user types text and checkbox is not checked, check it automatically
		if (text && !existingItem) {
			onChange([...selectedOptions, { type: value, text }]);
		} else if (existingItem) {
			onChange(selectedOptions.map((item) => (item.type === value ? { ...item, text } : item)));
		}
	};

	const renderOption = (option: CheckboxAccordionOption<ValueType>) => {
		const isOpen = openOptions.has(option.value);
		const existingItem = selectedOptions.find((item) => item.type === option.value);
		const isChecked = !!existingItem;
		const textValue = existingItem?.text || '';
		const hasError = showValidation && isChecked && !textValue;

		return (
			<div
				className={clsx(styles['c-checkbox-accordion__item'], {
					[styles['c-checkbox-accordion__item-selected']]: isChecked,
					[styles['c-checkbox-accordion__item-closed']]: !isOpen,
				})}
				key={String(option.value)}
			>
				<div className={clsx(styles['c-checkbox-accordion__item-header'])}>
					<div className={clsx(styles['c-checkbox-accordion__item-header-title'])}>
						<Checkbox
							className={clsx(styles['c-checkbox-accordion__item-checkbox'])}
							label={option.label}
							checked={isChecked}
							onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
						/>
					</div>
					{option.description && (
						<Button
							className={clsx(styles['c-checkbox-accordion__item-icon'])}
							icon={
								<Icon
									name={isOpen ? IconNamesLight.AngleUp : IconNamesLight.AngleDown}
									aria-hidden
								/>
							}
							variants="text"
							ariaLabel={isOpen ? tText('Sluit accordion') : tText('Open accordion')}
							onClick={() => toggleOpenOption(option.value)}
						/>
					)}
				</div>
				{isOpen && option.description && (
					<div className={clsx(styles['c-checkbox-accordion__item-body'])}>
						<div className={clsx(styles['c-checkbox-accordion__item-description'])}>
							{option.description}
						</div>
						<div className={clsx(styles['c-checkbox-accordion__item-textarea'])}>
							<TextArea
								id={`checkbox-accordion-${String(option.value)}`}
								value={textValue}
								onChange={(e) => handleTextChange(option.value, e.target.value)}
								maxLength={option.maxLength || 500}
								ariaLabel={option.label}
							/>
							<div className={clsx(styles['c-checkbox-accordion__item-char-count'])}>
								{textValue.length} / {option.maxLength || 500}
							</div>
							{hasError && (
								<RedFormWarning
									className={clsx(styles['c-checkbox-accordion__item-error'])}
									error={tText('Dit veld is verplicht')}
								/>
							)}
						</div>
					</div>
				)}
			</div>
		);
	};

	const renderErrors = () => {
		if (!error) {
			return [];
		}
		return [
			<RedFormWarning
				className={clsx(styles['c-checkbox-accordion__form-error'])}
				error={error}
				key="form-error--checkbox-accordion"
			/>,
		];
	};

	return (
		<div className={clsx(className, styles['c-checkbox-accordion'])}>
			<FormControl label={title} errors={renderErrors()}>
				{options.map(renderOption)}
			</FormControl>
		</div>
	);
}

export default CheckboxAccordion;
