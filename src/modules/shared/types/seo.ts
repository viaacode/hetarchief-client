import { type DehydratedState } from '@tanstack/react-query';

export interface DefaultSeoInfo {
	url: string;
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
	};
}
