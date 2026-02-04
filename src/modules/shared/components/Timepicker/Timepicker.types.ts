import type { ReactNode } from 'react';
import type { DatePickerProps } from 'react-datepicker';

import type { DefaultComponentProps } from '../../types';

export type TimepickerProps = DefaultComponentProps &
	DatePickerProps & {
		children?: ReactNode;
	};
