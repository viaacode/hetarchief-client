import { Locale } from '@shared/utils/i18n';

const collators: Partial<Record<Locale, Intl.Collator>> = {};

/**
 * Alphabetical order in the language of the UI, so accented labels land where a reader of that
 * language expects them.
 */
export const compareLabels = (
	locale: Locale = Locale.nl
): ((labelA: string, labelB: string) => number) => {
	collators[locale] ??= new Intl.Collator(locale, { sensitivity: 'base', numeric: true });
	return (labelA, labelB) => (collators[locale] as Intl.Collator).compare(labelA, labelB);
};
