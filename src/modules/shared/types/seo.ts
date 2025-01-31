import type { DehydratedState } from '@tanstack/react-query';

import type { Locale } from '@shared/utils/i18n';

export interface DefaultSeoInfo {
	url: string;
	locale: Locale;
	title?: string | null;
	description?: string | null;
	image?: string | null;
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
