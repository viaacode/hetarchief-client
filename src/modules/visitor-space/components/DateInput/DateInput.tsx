import { TextInput } from '@meemoo/react-components';
import { isValid } from 'date-fns';
import { FC } from 'react';
import DatePicker from 'react-datepicker';

import { Icon, IconNamesLight } from '@shared/components';
import { datePickerDefaultProps } from '@shared/components/DatePicker/DatePicker.consts';

import styles from './DateInput.module.scss';

// Wrap the Datepicker in a div and define an input & formatting
// The wrapping div ensures the tab loop element doesn't mess with grids (i.e. DateRangeInput)

export interface DateInputProps {
	label?: string;
	disabled?: boolean;
	id?: string;
	onChange: (date: Date) => void;
	value?: Date;
	className?: string;
}

const DateInput: FC<DateInputProps> = ({ onChange, value, id, disabled, label, className }) => {
	return (
		<div className={styles['c-date-input']}>
			<p className={styles['c-date-input__label']}>{label}</p>
			<DatePicker
				{...datePickerDefaultProps}
				id={id}
				onChange={onChange}
				className={className}
				disabled={disabled}
				selected={isValid(value) ? value : new Date()}
				dateFormat="dd/MM/yyyy"
				placeholderText="dd/mm/jjjj"
				customInput={<TextInput iconStart={<Icon name={IconNamesLight.Calendar} />} />}
			/>
		</div>
	);
};

export default DateInput;
