import { Button, Checkbox, FormControl, TextArea } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './CheckboxAccordion.module.scss';
import type { CheckboxAccordionOption, CheckboxAccordionProps } from './CheckboxAccordion.types';

function CheckboxAccordion<ValueType>({
	className,
	prefix,
	title,
	options,
	selectedOptions,
	onChange,
	error,
	showValidation = false,
}: CheckboxAccordionProps<ValueType>) {
	const [openOptions, setOpenOptions] = useState<Set<ValueType>>(new Set());
	const [fieldsWithErrors, setFieldsWithErrors] = useState<Set<ValueType>>(new Set());

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run when showValidation changes, not when selectedOptions changes
	useEffect(() => {
		if (!showValidation) {
			setFieldsWithErrors(new Set());
			return;
		}

		// Find out which fields have errors when validation is triggered
		const errors = new Set<ValueType>();
		selectedOptions.forEach((item) => {
			if (!item.text) {
				errors.add(item.type);
			}
		});
		setFieldsWithErrors(errors);

		// Open accordions with errors
		setOpenOptions((prev) => {
			const newOpenOptions = new Set(prev);
			errors.forEach((type) => {
				newOpenOptions.add(type);
			});
			return newOpenOptions;
		});
	}, [showValidation]);

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
		const hasError = showValidation && fieldsWithErrors.has(option.value);
		const textAreaMaxLength = option.maxLength || 500;

		return (
			<div
				className={styles['c-checkbox-accordion__item']}
				key={`${prefix}__option-${String(option.value)}`}
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

					<Button
						className={styles['c-checkbox-accordion__item-icon']}
						icon={
							<Icon name={isOpen ? IconNamesLight.AngleUp : IconNamesLight.AngleDown} aria-hidden />
						}
						variants="text"
						ariaLabel={isOpen ? tText('Sluit accordion') : tText('Open accordion')}
						onClick={() => toggleOpenOption(option.value)}
					/>
				</div>

				{isOpen && (
					<>
						<div className={clsx(styles['c-checkbox-accordion__item-body'])}>
							<div className={clsx(styles['c-checkbox-accordion__item-description'])}>
								{option.description}
							</div>
							<div className={clsx(styles['c-checkbox-accordion__item-textarea'])}>
								<TextArea
									id={`${prefix}__textarea-${String(option.value)}`}
									value={textValue}
									onChange={(e) => handleTextChange(option.value, e.target.value)}
									maxLength={textAreaMaxLength}
									ariaLabel={option.label}
								/>
								<div className={clsx(styles['c-checkbox-accordion__item-char-count'])}>
									{textValue.length} / {textAreaMaxLength}
								</div>
							</div>
						</div>

						{hasError && (
							<RedFormWarning
								className={clsx(styles['c-checkbox-accordion__item-error'])}
								error={tText('Dit veld is verplicht')}
							/>
						)}
					</>
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
				key={`${prefix}__form-error`}
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
