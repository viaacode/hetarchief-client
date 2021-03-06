import { DatepickerProps, historicDatepicker, TextInput } from '@meemoo/react-components';
import { FC } from 'react';

import { Datepicker, Icon } from '@shared/components';
import { asDate, formatMediumDate } from '@shared/utils';

import styles from './DateInput.module.scss';

// Wrap the Datepicker in a div and define an input & formatting
// The wrapping div ensures the tab loop element doesn't mess with grids (i.e. DateRangeInput)

const DateInput: FC<DatepickerProps> = (props) => (
	<div className={styles['c-date-input']}>
		<Datepicker
			{...historicDatepicker}
			maxDate={null}
			{...props}
			value={formatMediumDate(asDate(props.value))}
			selected={asDate(props.value)}
			customInput={<TextInput iconStart={<Icon name="calendar" />} />}
		/>
	</div>
);

export default DateInput;
