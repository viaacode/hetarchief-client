import { Locale } from '@shared/utils/i18n';
import { enGB } from 'date-fns/locale';
import nlBE from 'date-fns/locale/nl-BE';
import type { DatePickerProps } from 'react-datepicker';

export function getDatePickerDefaultProps(
	locale: Locale
): Pick<
	DatePickerProps,
	| 'wrapperClassName'
	| 'calendarClassName'
	| 'popperClassName'
	| 'showPopperArrow'
	| 'showMonthDropdown'
	| 'showYearDropdown'
	| 'dropdownMode'
	| 'calendarStartDay'
	| 'locale'
	| 'scrollableYearDropdown'
	| 'yearDropdownItemNumber'
	| 'minDate'
	| 'maxDate'
> {
	return {
		wrapperClassName: 'c-datepicker',
		calendarClassName: 'c-datepicker',
		popperClassName: 'c-datepicker',
		showPopperArrow: false,
		showMonthDropdown: true,
		showYearDropdown: true,
		dropdownMode: 'select' as const,
		calendarStartDay: 1,
		locale: { [Locale.nl]: nlBE, [Locale.en]: enGB }[locale] as DatePickerProps['locale'],
		scrollableYearDropdown: true,
		yearDropdownItemNumber: 400,
		minDate: new Date(1700, 0, 1),
		maxDate: new Date(2050, 11, 31),
	};
}
