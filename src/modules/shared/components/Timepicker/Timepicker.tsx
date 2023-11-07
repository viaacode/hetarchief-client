import clsx from 'clsx';
import React, { FC } from 'react';
import ReactDatePicker from 'react-datepicker';

import { TimepickerProps } from './Timepicker.types';

// This component only wraps in the styling
import 'react-datepicker/dist/react-datepicker.min.css';

// Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
// https://github.com/Hacker0x01/react-datepicker/issues/3834#issuecomment-1451662259
const DatePicker =
	(ReactDatePicker as unknown as { default: typeof ReactDatePicker }).default ?? ReactDatePicker;

const Timepicker: FC<TimepickerProps> = (props) => {
	const { className } = props;

	const classNames = clsx(className, 'c-datepicker', 'c-datepicker--time');

	return (
		<DatePicker
			wrapperClassName={classNames}
			calendarClassName={classNames}
			popperClassName={classNames}
			showPopperArrow={false}
			showMonthDropdown
			showYearDropdown
			dropdownMode="select"
			timeFormat="HH:mm"
			{...props}
		/>
	);
};

export default Timepicker;
