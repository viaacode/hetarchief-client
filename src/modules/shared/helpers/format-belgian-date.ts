import { format } from 'date-fns';

export function formatAsBelgianDate(
	date: string | Date,
	dateFormat = 'dd/MM/yyyy HH:mm',
	options: Parameters<typeof format>[2] = {}
): string {
	let dateObj;
	if (typeof date === 'string') {
		dateObj = new Date(date + (date.toLocaleLowerCase().endsWith('z') ? '' : 'Z'));
	} else {
		dateObj = date;
	}
	return format(dateObj, dateFormat, options);
}
