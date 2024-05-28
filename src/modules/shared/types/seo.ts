import { DehydratedState } from '@tanstack/react-query';

export interface DefaultSeoInfo {
	url: string;
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
	};
}
