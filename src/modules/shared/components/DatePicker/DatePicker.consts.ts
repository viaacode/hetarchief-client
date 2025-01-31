import { enGB } from 'date-fns/locale';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import type { ReactDatePickerProps } from 'react-datepicker';

import { Locale } from '@shared/utils/i18n';

export function getDatePickerDefaultProps(locale: Locale): Partial<ReactDatePickerProps> {
	return {
		wrapperClassName: 'c-datepicker',
		calendarClassName: 'c-datepicker',
		popperClassName: 'c-datepicker',
		showPopperArrow: false,
		showMonthDropdown: true,
		showYearDropdown: true,
		dropdownMode: 'select' as const,
		calendarStartDay: 1,
		locale: { [Locale.nl]: nlBE, [Locale.en]: enGB }[locale],
	};
}
