import { TextInput } from '@meemoo/react-components';
import { getDatePickerDefaultProps } from '@shared/components/DatePicker/DatePicker.consts';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { isValid } from 'date-fns';
import { noop } from 'lodash-es';
import type { FC } from 'react';
import ReactDatePicker from 'react-datepicker';

import styles from './DateInput.module.scss';

// Wrap the Datepicker in a div and define an input & formatting
// The wrapping div ensures the tab loop element doesn't mess with grids (i.e. DateRangeInput)

export interface DateInputProps {
	label?: string;
	disabled?: boolean;
	id?: string;
	onChange: (date: Date | null) => void;
	onBlur?: (evt: Event) => void;
	value?: Date;
	className?: string;
	defaultValue?: Date;
}

const DateInput: FC<DateInputProps> = ({
	onChange,
	value,
	id,
	disabled,
	label,
	onBlur = noop,
	className,
	defaultValue,
}) => {
	const locale = useLocale();

	return (
		<div className={styles['c-date-input']}>
			{!!label && <p className={styles['c-date-input__label']}>{label}</p>}
			<ReactDatePicker
				{...getDatePickerDefaultProps(locale)}
				id={id}
				onChange={(newDate) => onChange(newDate)}
				onBlur={onBlur}
				className={className}
				disabled={disabled}
				selected={isValid(value) ? value : defaultValue}
				dateFormat="dd/MM/yyyy"
				placeholderText="dd/mm/jjjj"
				popperPlacement="bottom-start"
				customInput={<TextInput iconStart={<Icon name={IconNamesLight.Calendar} />} />}
			/>
		</div>
	);
};

export default DateInput;
