import { differenceInDays, format, formatDistanceToNow, isSameDay, isToday } from 'date-fns';
import { i18n } from 'next-i18next';

import { getLocaleFromi18nLanguage } from './i18n';

// Shared

export const asDate = (input: Date | string | undefined | null): Date | undefined => {
	const isEmpty = !input;
	const isNumber = !isNaN(Number(input));
	const isInvalidString =
		typeof input === 'string' && (input.length <= 0 || input === 'undefined');

	if (isEmpty || isInvalidString) {
		return undefined;
	}

	const lowercased = typeof input === 'string' && input.toLowerCase();
	const timezoned =
		lowercased &&
		lowercased.includes('t') &&
		!lowercased.endsWith('z') &&
		!lowercased.includes('+')
			? `${input}Z`
			: input;

	return new Date(isNumber ? Number(timezoned) : timezoned);
};

export const localisedOptions = {
	locale: getLocaleFromi18nLanguage(i18n?.language || ''),
};

// Do not export to contain all user-facing formatters here
const formatWithLocale = (formatString: string, date?: Date): string => {
	return date ? format(date, formatString, { ...localisedOptions }) : '';
};

// 09:30
export const formatTime = (date?: Date): string => formatWithLocale('p', date);

// 13/04/2022
export const formatDate = (date?: Date): string => formatWithLocale('P', date);

// 13 apr. 2022
export const formatMediumDate = (date?: Date): string => formatWithLocale('PP', date);

// 13 apr. 2022, 09:30
export const formatMediumDateWithTime = (date?: Date): string => formatWithLocale('PPp', date);

// 13 april 2022
export const formatLongDate = (date?: Date): string => formatWithLocale('PPP', date);

// 13 apr. 2022, 09:30
// 13 apr. 2022, 09:30 - 10:30
// 13 apr. 2022, 09:30 - 23 apr. 2033, 10:30
export const formatSameDayRange = (from?: Date | string, to?: Date | string): string => {
	const f = from ? asDate(from) : undefined;
	const t = to ? asDate(to) : undefined;

	if (f && !t) return formatMediumDateWithTime(f);
	if (!f && t) return formatMediumDateWithTime(t);

	const start = formatMediumDateWithTime(f);
	const end = f && t && isSameDay(f, t) ? formatTime(t) : formatMediumDateWithTime(t);

	return `${start} - ${end}`;
};

// 10 minuten geleden
// 3 uur geleden
// 13 apr. 2022, 09:30
export const formatDistanceToday = (input: Date | string): string => {
	const date = asDate(input);

	if (date && differenceInDays(new Date(), date) <= 1) {
		return formatDistanceToNow(date, {
			...localisedOptions,
			addSuffix: true,
		});
	}

	return date ? formatMediumDateWithTime(date) : '';
};

// 09:30
// 13/04/2022
export const formatSameDayTimeOrDate = (date?: Date): string => {
	return date && isToday(date) ? formatTime(date) : formatDate(date);
};
