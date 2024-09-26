import { TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { type FC } from 'react';
import ReactDatePicker from 'react-datepicker';

import { getDatePickerDefaultProps } from '@shared/components/DatePicker/DatePicker.consts';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { useLocale } from '@shared/hooks/use-locale/use-locale';

import { type TimepickerProps } from './Timepicker.types';

// Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.
// https://github.com/Hacker0x01/react-datepicker/issues/3834#issuecomment-1451662259
const DatePicker =
	(ReactDatePicker as unknown as { default: typeof ReactDatePicker }).default ?? ReactDatePicker;

const Timepicker: FC<TimepickerProps> = (props) => {
	const locale = useLocale();
	const { className } = props;

	const classNames = clsx(className, 'c-datepicker', 'c-datepicker--time');

	return (
		<DatePicker
			{...getDatePickerDefaultProps(locale)}
			showTimeSelect
			showTimeSelectOnly
			timeIntervals={15}
			autoComplete="off"
			wrapperClassName={classNames}
			calendarClassName={classNames}
			popperClassName={classNames}
			dateFormat="HH:mm"
			timeFormat="HH:mm"
			popperPlacement="bottom-start"
			customInput={<TextInput iconStart={<Icon name={IconNamesLight.Clock} />} />}
			{...props}
		/>
	);
};

export default Timepicker;
