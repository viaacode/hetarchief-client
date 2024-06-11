import { DehydratedState } from '@tanstack/react-query';
import getConfig from 'next/config';
import { GetServerSidePropsContext, GetStaticPropsResult } from 'next/types';
import { i18n } from 'next-i18next';

import { getTranslations } from '@i18n/helpers/get-translations';
import { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

export async function getDefaultStaticProps(
	context: GetServerSidePropsContext,
	dehydratedState?: DehydratedState,
	url?: string | null,
	title?: string | null,
	description?: string | null,
	image?: string | null
): Promise<GetStaticPropsResult<DefaultSeoInfo>> {
	const locale = (context.locale || Locale.nl) as Locale;
	const translations = await getTranslations(locale);
	i18n?.addResources(locale, 'common', translations);

	let resolvedUrl: string;
	if (!url) {
		resolvedUrl = publicRuntimeConfig.CLIENT_URL;
	} else if (url.startsWith('http')) {
		// Absolute url
		resolvedUrl = url;
	} else {
		// relative url
		resolvedUrl =
			publicRuntimeConfig.CLIENT_URL + '/' + (context.locale || Locale.nl) + (url || '');
	}

	return {
		props: {
			url: resolvedUrl,
			title: title || null,
			description: description || null,
			image: image || null,
			...(dehydratedState ? { dehydratedState } : {}),
			_nextI18Next: {
				initialI18nStore: {
					[locale]: {
						common: translations,
					},
				},
			},
		},
	};
}
