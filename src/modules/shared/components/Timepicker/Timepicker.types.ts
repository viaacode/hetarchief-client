import { ReactNode } from 'react';
import { ReactDatePickerProps } from 'react-datepicker';

import { DefaultComponentProps } from '../../types';

export interface TimepickerProps extends DefaultComponentProps, ReactDatePickerProps {
	children?: ReactNode;
}
