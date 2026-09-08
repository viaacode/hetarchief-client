import type { Locale } from '@shared/utils/i18n';

const collators: Partial<Record<Locale, Intl.Collator>> = {};

/**
 * Compares two labels in the language of the UI, so accented labels land where a reader of that
 * language expects them. Use it directly to sort a list that holds more than the label.
 */
export const getLabelCollator = (locale: Locale): Intl.Collator => {
	collators[locale] ??= new Intl.Collator(locale, { sensitivity: 'base', numeric: true });
	return collators[locale] as Intl.Collator;
};

export const sortAccentIndependent = (labels: string[], locale: Locale): string[] =>
	[...labels].sort(getLabelCollator(locale).compare);
