import { format, isSameDay } from 'date-fns';
import { i18n } from 'next-i18next';

import { getLocaleFromi18nLanguage } from './i18n';

// Shared

export const parseDatabaseDate = (databaseDate: Date | string): Date => {
	let dateObj: Date;
	if (typeof databaseDate === 'string') {
		if (databaseDate.toLowerCase().includes('t') && !databaseDate.toLowerCase().endsWith('z')) {
			dateObj = new Date(databaseDate + 'Z');
		} else {
			dateObj = new Date(databaseDate);
		}
	} else {
		dateObj = databaseDate as Date;
	}
	return dateObj;
};

export const formatWithLocale = (formatString: string, date?: Date): string => {
	const locale = getLocaleFromi18nLanguage(i18n?.language || '');
	return date ? format(date, formatString, { locale }) : '';
};

export const formatAccessDate = (date?: Date): string => {
	return formatWithLocale('PPp', date);
};

// Used in:
// - beheer/bezoekers
// - account/mijn-historiek

export const formatAccessDates = (from?: Date | string, to?: Date | string): string => {
	const f = from ? parseDatabaseDate(from) : undefined;
	const t = to ? parseDatabaseDate(to) : undefined;

	if (f && !t) return formatAccessDate(f);
	if (!f && t) return formatAccessDate(t);

	const start = formatAccessDate(f);
	const end = f && t && isSameDay(f, t) ? formatWithLocale('p', t) : formatAccessDate(t);

	return `${start} - ${end}`;
};
