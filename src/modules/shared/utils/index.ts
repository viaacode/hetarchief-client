import { Locale } from 'date-fns';
import { nlBE } from 'date-fns/locale';

export * from './is-browser';
export * from './seo';

export function getLocaleFromi18nLanguage(language: string): Locale {
	switch (language) {
		case 'nl':
		default:
			return nlBE;
	}
}
