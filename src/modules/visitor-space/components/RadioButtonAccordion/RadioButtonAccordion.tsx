import { Button, FormControl, RadioButton } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tText } from '@shared/helpers/translate';
import { Form } from '@viaa/avo2-components';
import clsx from 'clsx';
import { useState } from 'react';
import styles from './RadioButtonAccordion.module.scss';
import type { RadioButtonAccordionOption } from './RadioButtonAccordion.types';

interface RadioButtonAccordionProps<OptionValueType> {
	title?: string;
	options: RadioButtonAccordionOption<OptionValueType>[];
	radioButtonGroupLabel: string;
	selectedOption: OptionValueType | null;
	onChange: (optionValue: OptionValueType) => void;
	error?: string | null;
}

function RadioButtonAccordion<OptionValueType>({
	title,
	options,
	radioButtonGroupLabel,
	selectedOption,
	onChange,
	error,
}: RadioButtonAccordionProps<OptionValueType>) {
	const [openOption, setOpenOption] = useState<OptionValueType | null>(null);

	const toggleOpenOption = (option: RadioButtonAccordionOption<OptionValueType>) => {
		if (openOption === option.value) {
			setOpenOption(null);
		} else {
			setOpenOption(option.value);
		}
	};

	const handleSelection = (option: RadioButtonAccordionOption<OptionValueType>) => {
		if (option.value !== selectedOption) {
			setOpenOption(null);
			onChange(option.value);
		}

		if (option.openOnSelect) {
			setOpenOption(option.value);
		}
	};

	const renderOption = (option: RadioButtonAccordionOption<OptionValueType>) => {
		const isAccordionOpen = openOption === option.value;
		const isAccordionSelected = selectedOption === option.value;

		return (
			<div
				className={clsx(styles['c-radiobutton-accordion__item'], {
					[styles['c-radiobutton-accordion__item-selected']]: isAccordionSelected,
					[styles['c-radiobutton-accordion__item-closed']]: !isAccordionOpen,
				})}
			>
				<div className={clsx(styles['c-radiobutton-accordion__item-header'])}>
					{/** biome-ignore lint/a11y/noStaticElementInteractions: Entire title should behave as if the radiobutton was clicked */}
					{/** biome-ignore lint/a11y/useKeyWithClickEvents: Entire title should behave as if the radiobutton was clicked */}
					<div
						className={clsx(styles['c-radiobutton-accordion__item-header-title'])}
						onClick={() => handleSelection(option)}
					>
						<RadioButton
							aria-labelledby={radioButtonGroupLabel}
							className={clsx(styles['c-radiobutton-accordion__item-radio-button'])}
							label={option.label}
							checked={isAccordionSelected}
							onClick={() => handleSelection(option)}
						/>
					</div>
					<Button
						className={clsx(styles['c-radiobutton-accordion__item-icon'])}
						icon={
							<Icon name={isAccordionOpen ? IconNamesLight.AngleUp : IconNamesLight.AngleDown} />
						}
						variants="text"
						aria-label={isAccordionOpen ? tText('Open accordion') : tText('Close accordion')}
						onClick={() => toggleOpenOption(option)}
					/>
				</div>
				{isAccordionOpen && (
					<div className={clsx(styles['c-radiobutton-accordion__item-body'])}>
						{option.description}
					</div>
				)}
			</div>
		);
	};

	return (
		<Form className={clsx(styles['c-radiobutton-accordion'])}>
			<FormControl
				id={radioButtonGroupLabel}
				label={title}
				errors={[
					<RedFormWarning
						className={clsx(styles['c-radiobutton-accordion__form-error'])}
						error={error}
						key={`form-error--${radioButtonGroupLabel}`}
					/>,
				]}
			>
				{options.map(renderOption)}
			</FormControl>
		</Form>
	);
}

export default RadioButtonAccordion;
