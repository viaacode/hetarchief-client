import { DatepickerProps, historicDatepicker, TextInput } from '@meemoo/react-components';
import { FC } from 'react';
import DatePicker from 'react-datepicker';

import { Icon, IconNamesLight } from '@shared/components';
import { asDate, formatMediumDate } from '@shared/utils';

import styles from './DateInput.module.scss';

// Wrap the Datepicker in a div and define an input & formatting
// The wrapping div ensures the tab loop element doesn't mess with grids (i.e. DateRangeInput)

// Warning: including `maxDate` in any way destroys keyboard navigation
// See https://stackoverflow.com/a/63564880
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { maxDate, ...rest } = historicDatepicker;

interface DateInputProps extends DatepickerProps {
	label?: string;
}

const DateInput: FC<DateInputProps> = (props) => (
	<div className={styles['c-date-input']}>
		<p className={styles['c-date-input__label']}>{props.label}</p>
		<DatePicker
			{...rest}
			{...props}
			value={formatMediumDate(asDate(props.value))}
			selected={asDate(props.value)}
			customInput={<TextInput iconStart={<Icon name={IconNamesLight.Calendar} />} />}
			wrapperClassName="c-datepicker"
			calendarClassName="c-datepicker"
			popperClassName="c-datepicker"
			showPopperArrow={false}
			showMonthDropdown
			showYearDropdown
			dropdownMode="select"
		/>
	</div>
);

export default DateInput;
