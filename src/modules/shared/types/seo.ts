import type { Locale } from '@shared/utils/i18n';
import type { DehydratedState } from '@tanstack/react-query';

/** An absolute url of this page in one specific language, used to render hreflang tags */
export interface PageInfo {
	url: string;
	languageCode: Locale;
}

export interface DefaultSeoInfo {
	url: string;
	locale: Locale;
	title?: string | null;
	description?: string | null;
	image?: string | null;
	canonicalUrl?: string | null;
	/** Absolute urls of this same page in every available language, including the current one */
	translatedPages?: PageInfo[];
	dehydratedState?: DehydratedState;
	_nextI18Next?: {
		initialI18nStore: {
			nl?: {
				common: Record<string, string>;
			};
			en?: {
				common: Record<string, string>;
			};
		};
		initialLocale: Locale;
		ns: ['common'];
	};
}
