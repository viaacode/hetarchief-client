import { TextInput } from '@meemoo/react-components';
import { getDatePickerDefaultProps } from '@shared/components/DatePicker/DatePicker.consts';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import clsx from 'clsx';
import React, { type FC } from 'react';
import ReactDatePicker from 'react-datepicker';
import type { TimepickerProps } from './Timepicker.types';

const Timepicker: FC<TimepickerProps> = (props) => {
	const locale = useLocale();
	const { className } = props;

	const classNames = clsx(className, 'c-datepicker', 'c-datepicker--time');

	return (
		<ReactDatePicker
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
			// biome-ignore lint/suspicious/noExplicitAny: datepicker props are strange
			{...(props as any)}
		/>
	);
};

export default Timepicker;
