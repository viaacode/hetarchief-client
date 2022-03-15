import { format } from 'date-fns';

type DateFnsFormatOptions = {
	locale?: Locale;
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	firstWeekContainsDate?: number;
	useAdditionalWeekYearTokens?: boolean;
	useAdditionalDayOfYearTokens?: boolean;
};

export function formatAsBelgianDate(
	date: string | Date,
	dateFormat = 'dd/MM/yyyy HH:mm',
	options: DateFnsFormatOptions = {}
): string {
	let dateObj;
	if (typeof date === 'string') {
		dateObj = new Date(date + (date.toLocaleLowerCase().endsWith('z') ? '' : 'Z'));
	} else {
		dateObj = date;
	}
	return format(dateObj, dateFormat, options);
}
