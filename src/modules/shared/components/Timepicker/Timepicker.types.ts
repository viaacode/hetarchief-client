import type { ReactNode } from 'react';
import type { ReactDatePickerProps } from 'react-datepicker';

import type { DefaultComponentProps } from '../../types';

export interface TimepickerProps extends DefaultComponentProps, ReactDatePickerProps {
	children?: ReactNode;
}
