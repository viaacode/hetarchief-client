import { DatepickerProps, TextInput } from '@meemoo/react-components';
import { FC } from 'react';

import { Datepicker, Icon } from '@shared/components';

const DateInput: FC<DatepickerProps> = (props) => (
	<Datepicker {...props} customInput={<TextInput iconStart={<Icon name="calendar" />} />} />
);

export default DateInput;
