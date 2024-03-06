import { DehydratedState } from '@tanstack/query-core/src/hydration';

export interface DefaultSeoInfo {
	url: string;
	dehydratedState?: DehydratedState;
	_nextI18Next: {
		initialI18nStore: {
			nl: {
				common: Record<string, string>;
			};
		};
	};
}
