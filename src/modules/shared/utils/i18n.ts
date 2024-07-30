import { type Locale as DateFnsLocale } from 'date-fns';
import nlBE from 'date-fns/locale/nl-BE/index.js';

export function getLocaleFromI18nLanguage(language: string): DateFnsLocale {
	switch (language) {
		case 'nl':
		default:
			return nlBE;
	}
}

export enum Locale {
	nl = 'nl',
	en = 'en',
}
