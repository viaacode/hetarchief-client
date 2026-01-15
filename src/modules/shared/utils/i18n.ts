import type { Locale as DateFnsLocale } from 'date-fns';
import enGB from 'date-fns/locale/en-GB';
import nlBE from 'date-fns/locale/nl-BE';

export function getLocaleFromI18nLanguage(language: Locale): DateFnsLocale {
	switch (language) {
		case 'en':
			return enGB;

		case 'nl':
			return nlBE;

		default:
			return nlBE;
	}
}

export enum Locale {
	nl = 'nl',
	en = 'en',
}
