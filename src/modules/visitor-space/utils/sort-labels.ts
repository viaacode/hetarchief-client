import type { Locale } from '@shared/utils/i18n';

const collators: Partial<Record<Locale, Intl.Collator>> = {};

const getCollator = (locale: Locale): Intl.Collator => {
	collators[locale] ??= new Intl.Collator(locale, { sensitivity: 'base', numeric: true });
	return collators[locale] as Intl.Collator;
};

/**
 * Alphabetical order in the language of the UI, so accented labels land where a reader of that
 * language expects them. Pass `getLabel` to sort a list that holds more than the label.
 */
export const sortAccentIndependent = <T>(
	items: T[],
	locale: Locale,
	getLabel: (item: T) => string = String
): T[] => {
	const collator = getCollator(locale);
	return [...items].sort((itemA, itemB) => collator.compare(getLabel(itemA), getLabel(itemB)));
};
