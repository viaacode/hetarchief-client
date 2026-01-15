import { Locale } from '@shared/utils/i18n';
import { enGB } from 'date-fns/locale';
import nlBE from 'date-fns/locale/nl-BE';
import type { ReactDatePickerProps } from 'react-datepicker';

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
		scrollableYearDropdown: true,
		yearDropdownItemNumber: 400,
		minDate: new Date(1700, 0, 1),
		maxDate: new Date(2050, 11, 31),
	};
}
