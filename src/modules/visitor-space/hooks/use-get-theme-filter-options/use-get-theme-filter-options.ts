import { useGetThemes } from '@shared/hooks/use-get-themes/use-get-themes';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { type Theme, ThemeOrderProp } from '@shared/services/themes-service';
import { Locale } from '@shared/utils/i18n';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { useMemo } from 'react';

// Themes are editorially managed, so there are only ever a handful of them.
// Fetching them all in one go lets the filter search client side, like the other checkbox filters do.
const THEME_FILTER_OPTIONS_PAGE_SIZE = 500;

export interface ThemeFilterOption {
	/** The theme slug. This is what ends up in the url and in the elasticsearch filter */
	value: string;
	/** The theme name in the language of the UI */
	label: string;
}

export interface ThemeFilterOptions {
	/** All themes, sorted alphabetically by their name in the language of the UI */
	options: ThemeFilterOption[];
	/** Slug to name in the language of the UI, used to label the pills in the search bar */
	labelsBySlug: Record<string, string>;
	isLoading: boolean;
}

/**
 * The options of the "Thema" search filter: every theme, labelled in the language of the UI.
 *
 * Only the slug is stored in the url and sent to elasticsearch, so the same url renders its pills
 * in Dutch or in English depending on the language the visitor is using. See ARC-3797.
 */
export const useGetThemeFilterOptions = (): ThemeFilterOptions => {
	const locale = useLocale();

	const { data: themesPaginated, isLoading } = useGetThemes({
		size: THEME_FILTER_OPTIONS_PAGE_SIZE,
		orderProp: locale === Locale.en ? ThemeOrderProp.nameEn : ThemeOrderProp.nameNl,
		orderDirection: AvoSearchOrderDirection.ASC,
	});

	return useMemo(() => {
		const getThemeName = (theme: Theme): string =>
			locale === Locale.en ? theme.nameEn : theme.nameNl;

		const options: ThemeFilterOption[] = (themesPaginated?.items || []).map((theme) => ({
			value: theme.slug,
			label: getThemeName(theme),
		}));

		return {
			options,
			labelsBySlug: Object.fromEntries(options.map(({ value, label }) => [value, label])),
			isLoading,
		};
	}, [themesPaginated?.items, locale, isLoading]);
};
