import { TextInput } from '@meemoo/react-components';
import { FC, SyntheticEvent } from 'react';
import DatePicker from 'react-datepicker';

import { Icon, IconNamesLight } from '@shared/components';
import { datePickerDefaultProps } from '@shared/components/DatePicker/DatePicker.consts';
import { asDate, formatMediumDate } from '@shared/utils';

import styles from './DateInput.module.scss';

// Wrap the Datepicker in a div and define an input & formatting
// The wrapping div ensures the tab loop element doesn't mess with grids (i.e. DateRangeInput)

export interface DateInputProps {
	label?: string;
	disabled?: boolean;
	id?: string;
	onChange: (date: Date | null, event: SyntheticEvent<any, Event> | undefined) => void;
	value?: string;
	className?: string;
}

const DateInput: FC<DateInputProps> = (props) => (
	<div className={styles['c-date-input']}>
		<p className={styles['c-date-input__label']}>{props.label}</p>
		<DatePicker
			{...datePickerDefaultProps}
			{...props}
			className={props.className}
			value={formatMediumDate(asDate(props.value))}
			selected={asDate(props.value)}
			customInput={<TextInput iconStart={<Icon name={IconNamesLight.Calendar} />} />}
		/>
	</div>
);

export default DateInput;
